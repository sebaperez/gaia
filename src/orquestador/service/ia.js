var request = require('request');
var config = require('../config/config').config;

function interpretarMensaje(contenido, callback, err) {

   var iaProcessUrl = config.iaApiUrls.procesar;

   request.post({
      url: iaProcessUrl,
      json: true,
      body: {msj: contenido}
   }, function (error, response, body) {
      console.log('IA - respuesta: '+JSON.stringify(body));
      if(body.ok){
         callback(body);
      } else {
         err("El modulo de IA no pudo procesar el mensaje: " + contenido);
      }

   });

}

module.exports.interpretarMensaje = interpretarMensaje;
