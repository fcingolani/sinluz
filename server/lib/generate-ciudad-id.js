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
    'V. ESPANA': 'VILLA ESPANA',
    'MARMOL': 'JOSE MARMOL',
    'JOSE MARIA EZEIZA': 'EZEIZA',
    'BANDFIELD': 'BANFIELD',
    'LAVALLOL': 'LLAVALLOL',
    'ING. ALLAN': 'INGENIERO JUAN ALLAN',
    'C J LOMAS DEL PALOMAR': 'CIUDAD JARDIN LOMAS DEL PALOMAR',
    'CIUDAD DE TIGRE': 'TIGRE'
  },

  ids: {
    'ALMIRANTE BROWN/NUEVE DE ABRIL': 'ESTEBAN ECHEVERRIA/NUEVE DE ABRIL',
  }
};

module.exports = (partido, ciudad) => {
  partido = aliases.partidos[partido] || partido;
  ciudad = aliases.ciudades[ciudad] || ciudad;

  let id = `${partido}/${ciudad}`;

  return removeDiacritics((aliases.ids[id] || id).toUpperCase());
}