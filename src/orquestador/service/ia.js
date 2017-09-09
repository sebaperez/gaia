var request = require('request');
var config = require('../config/config').config;

function interpretarMensaje(contenido, callback) {

   var iaProcessUrl = config.iaApiUrls.procesar;

   request.post({
      url: iaProcessUrl,
      form: {msj: contenido}
   }, function (error, response, body) {

      var parsedBody = JSON.parse(body);

      if(parsedBody.ok){

         callback(parsedBody);

      } else {
         console.log("El modulo de IA no pudo procesar el mensaje: " + contenido);
      }

   });

}

module.exports.interpretarMensaje = interpretarMensaje;
