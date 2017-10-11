require('dotenv').config()

const _ = require('lodash');
const moment = require('moment');
const Sequelize = require('sequelize');

const enre = require('../lib/enre');
const generateCiudadId = require('../lib/generate-ciudad-id');

const models = require('../models');

function generateBlackoutKey(b) {
  return [
    b.ciudadId,
    b.subestacionId,
    b.subestacionNombre,
    b.alimentadorId
  ].join(';');
}

async function scrape(distribuidoraNombre) {

  let cortes = await enre.getCortes(distribuidoraNombre);

  let t = await models.sequelize.transaction();

  let activeBlackouts = await models.Corte.findAll({
    where: {
      distribuidoraNombre: distribuidoraNombre,
      finishedAt: { $eq: null }
    },
    transaction: t
  });

  let activeBlackoutsIndex = _.keyBy(activeBlackouts, generateBlackoutKey);

  for (let b of cortes.data) {

    b.ciudadId = generateCiudadId(b.partidoNombre, b.ciudadNombre);

    let k = generateBlackoutKey(b);

    if (!activeBlackoutsIndex[k]) {

      activeBlackoutsIndex[k] = await models.Corte.create({
        tipo: b.tipo,
        distribuidoraNombre: cortes.meta.distribuidoraNombre,
        etrAt: b.normalizacionEstimada || null,
        startedAt: cortes.meta.updatedAt,
        subestacionId: b.subestacionId || null,
        subestacionNombre: b.subestacionNombre || null,
        alimentadorId: b.alimentadorId || null,
        finishedAt: null,
        ciudadId: b.ciudadId
      }, {
          transaction: t
        });

      activeBlackouts.push(activeBlackoutsIndex[k]);

    }

    activeBlackoutsIndex[k]._fetched = b;
  }

  for (let b of activeBlackouts) {

    if (b._fetched) {

      try {
        let prevEstado = await models.Estado.findOne({
          where: {
            corteId: b.id,
            updatedAt: {
              [Sequelize.Op.lte]: cortes.meta.updatedAt
            }
          },
          order: models.sequelize.literal('updatedAt DESC')
        });

        if (prevEstado.afectados != b._fetched.afectados) {
          await b.createEstado({
            afectados: b._fetched.afectados,
            updatedAt: cortes.meta.updatedAt
          }, {
              transaction: t
            });
        } else {
          console.log("No cambió la cantidad de afectados");
        }


      } catch (e) {
        console.error("Error al crear estado");
      }

    } else {

      b.finishedAt = cortes.meta.updatedAt;
      await b.save({ transaction: t });

    }

  }

  await t.commit();
}

async function scrapeAll() {
  await scrape('edenor');
  await scrape('edesur');
}

scrapeAll();