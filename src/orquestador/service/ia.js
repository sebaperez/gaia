var request = require('request');
var config = require('../config/config').config;
var log = require('log4js').getLogger();
log.level = 'debug';

module.exports.interpretarMensaje = function (contenido, reject, callback) {

   var iaProcessUrl = config.iaApiUrls.procesar;

   request.post({
      url: iaProcessUrl,
      json: true,
      body: {msj: contenido}
   }, function (error, response, body) {
      if (reject && (error || response.statusCode != 200)) {
         reject(error || response.statusMessage)
      } else {
         if(body.ok){
            delete body.original_response;
            log.debug('[IA] Respuesta:', body);
            if(callback){
               callback(body);
            }
         } else {
            log.error("[IA] El modulo de IA no pudo procesar el mensaje: ", contenido)
            reject();
         }
      }
   });

}
