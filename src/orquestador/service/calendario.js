var request = require('request');
var config = require('../config/config').config;

function obtenerHueco(intervalos, callback) {

   var huecosUrl = config.calendarioApiUrls.huecos;

   request.post({
      url: huecosUrl,
      json: true,
      body: intervalos
   }, function (error, response, body) {
      callback(body);
   });

}

module.exports.obtenerHueco = obtenerHueco;
