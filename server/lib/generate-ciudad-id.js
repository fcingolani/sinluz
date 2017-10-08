const removeDiacritics = require('../lib/removediacritics');

const aliases = {

  partidos: {
    'CAPITAL': 'CAPITAL FEDERAL',
    'BUENOS AIRES': 'CAPITAL FEDERAL',
    '3 DE FEBRERO': 'TRES DE FEBRERO',
  },

  ciudades: {
    'VILLA PUEYRRED?N': 'VILLA PUEYRREDON',
    '9 DE ABRIL': 'NUEVE DE ABRIL',
    'GUTIERREZ': 'JUAN MARIA GUTIERREZ',
    'V. ESPANA': 'VILLA ESPANA'
  }
};

module.exports = (partido, ciudad) => {
  partido = aliases.partidos[partido] || partido;
  ciudad = aliases.ciudades[ciudad] || ciudad;

  return removeDiacritics((`${partido}/${ciudad}`).toUpperCase());
}