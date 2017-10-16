var request = require('request');
var config = require('../config/config').config;

function obtenerHueco(intervalos, ownerId, callback, err) {

   var huecosUrl = config.calendarioApiUrls.huecos;

   request.post({
      url: huecosUrl,
      json: true,
      body: intervalos,
      qs: {
         usuario: ownerId
      }
   }, function (error, response, body) {
      if(response.status != 200){
         err();
      } else {
         callback(body);
      }
   });

}

module.exports.obtenerHueco = obtenerHueco;
