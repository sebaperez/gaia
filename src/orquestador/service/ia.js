var request = require('request');
var config = require('../config/config').config;

function interpretarMensaje(contenido, callback) {

   var iaProcessUrl = config.iaApiUrls.procesar;

   request.post({
      url: iaProcessUrl,
      json: true,
      body: {msj: contenido}
   }, function (error, response, body) {

      if(body.ok){
         callback(body);
      } else {
         console.error("El modulo de IA no pudo procesar el mensaje: " + contenido);
      }

   });

}

module.exports.interpretarMensaje = interpretarMensaje;
