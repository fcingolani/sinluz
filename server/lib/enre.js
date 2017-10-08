let _ = require('lodash')
let Promise = require('bluebird');
let request = require('request');
let cheerio = require('cheerio');
let moment = require('moment-timezone');


const $request = require('./srequest');

function _extractCortes($, selector, tipo) {

  let headers = [];
  let cortes = [];
  let subestacionRegex = /(\d+)\s+\-\s+(.+)\s\/\s+(\d+)/;

  $(selector).each((i, tr) => {

    if (i === 0) {

      $(tr).find('th:not(:first-child)').each((j, th) => {
        headers.push($(th).text())
      });

    } else {

      if ($(tr).find('td:first-child').hasClass('estilo1')) {
        return;
      }

      let data = {};

      $(tr).find('td').each((j, td) => {
        data[headers[j]] = _.trim($(td).text())
      });



      let corte = {
        tipo: tipo,
        partidoNombre: data['PARTIDO'],
        ciudadNombre: data['LOCALIDAD / BARRIO'],
        afectados: parseInt(data['USUARIOS AFECTADOS']),
      };

      if (data['SUBESTACION / ALIMENTADOR']) {
        let m;

        if (m = data['SUBESTACION / ALIMENTADOR'].match(subestacionRegex)) {
          corte.subestacionId = m[1];
          corte.subestacionNombre = m[2];
          corte.alimentadorId = m[3];
        }

      }

      if (data['USUARIOS AFECTADOS']) {
        corte.usuariosAfectados = parseInt(data['USUARIOS AFECTADOS']);
      }

      if (data['HORA ESTIMADA DE NORMALIZACION']) {
        let normalizacionEstimadaRaw = data['HORA ESTIMADA DE NORMALIZACION'];
        let normalizacionEstimadaMoment = moment.tz(normalizacionEstimadaRaw, 'DD/MM/YYYY HH:mm', 'America/Argentina/Buenos_Aires');

        if (normalizacionEstimadaMoment.isValid()) {
          corte.normalizacionEstimada = normalizacionEstimadaMoment.unix();
        }
      }

      cortes.push(corte);

    }

  });

  return cortes;

}

let distribuidoras = {
  edesur: { nombre: 'edesur', sourceURL: 'http://www.enre.gov.ar/web/web.nsf/inicio_Edesur?openform' },
  edenor: { nombre: 'edenor', sourceURL: 'http://www.enre.gov.ar/web/web.nsf/inicio_Edenor?openform' },
}

module.exports = {

  getCortes(nombreDistribuidora) {

    let distribuidora = distribuidoras[nombreDistribuidora];

    if (distribuidora == null) {
      throw new Error(`Distribuidora desconocida "${nombreDistribuidora}"`);
    }

    return $request(distribuidora.sourceURL).then($ => {
      let ultimaActualizacionRaw = $('.nota').first().text();
      let ultimaActualizacionMoment = moment.tz(ultimaActualizacionRaw, 'HH:mm', 'America/Argentina/Buenos_Aires');
      let ultimaActualizacionStamp = ultimaActualizacionMoment.unix();

      let infoTDs = $('#Informacion_Superior td');
      let usuariosSinServicio = parseInt(infoTDs.first().text().replace(/\D/g, ''));
      let usuariosConServicio = parseInt(infoTDs.last().text().replace(/\D/g, ''));

      return {
        meta: {
          updatedAt: ultimaActualizacionStamp,
          distribuidoraNombre: nombreDistribuidora
        },
        data: _.concat(
          _extractCortes($, '#CortesPreventivos tr', 'preventivo'),
          _extractCortes($, '#CortesProgramados tr', 'programado'),
          _extractCortes($, '#InterrupcionesServicio tr', 'media-tension'),
          _extractCortes($, '#CortesBT tr', 'baja-tension')
        )
      };

    })

  }

}