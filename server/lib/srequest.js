const request = require('request');
const cheerio = require('cheerio');

module.exports = function $request(url) {

  return new Promise(function (resolve, reject) {
    request(url, function (err, response, body) {

      if (err)
        return reject(err);

      if (response.statusCode !== 200)
        return reject(response.statusMessage);

      let $ = cheerio.load(body);

      resolve($);
    });
  });

};