var request = require('request');
var config = require('../config/config').config;
var log = require('log4js').getLogger();
log.level = 'debug';

function interpretarMensaje(contenido, callback, err) {

   var iaProcessUrl = config.iaApiUrls.procesar;

   request.post({
      url: iaProcessUrl,
      json: true,
      body: {msj: contenido}
   }, function (error, response, body) {
      if(body.ok){
         delete body.original_response;
         log.debug('[IA] Respuesta:', body);
         callback(body);
      } else {
         err("El modulo de IA no pudo procesar el mensaje: " + contenido);
      }

   });

}

module.exports.interpretarMensaje = interpretarMensaje;
