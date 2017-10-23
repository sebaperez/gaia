var request = require('request');
var config = require('../config/config').config;
var log = require('log4js').getLogger();
log.level = 'debug';

function obtenerUsuario(emailRemitente, emailDestinatario, callback, err) {

   var usuarioRemitenteUrl = config.userApiUrls.clientes + '?filter[where][email]=' + emailRemitente + '&filter[limit]=1';
   log.debug("[Usuario] Buscando owner entre mails " + emailRemitente + " y " + emailDestinatario);
   request.get(usuarioRemitenteUrl, function (error, response, body) {
      if(body){
         var usuarioRemitente = JSON.parse(body)[0];
         if(usuarioRemitente) {
            callback(usuarioRemitente);
         } else {
            var usuarioDestinatarioUrl = config.userApiUrls.clientes + '?filter[where][email]=' + emailDestinatario + '&filter[limit]=1';
            request.get(usuarioDestinatarioUrl, function (error, response, body) {
               var usuarioDestinatario = JSON.parse(body)[0];
               if(usuarioDestinatario) {
                  callback(usuarioDestinatario);
               } else {
                  err("[Usuario] No existe un owner con el email " + emailRemitente + " ni " + emailDestinatario);
               }
            });
         }
      } else {
         err("[Usuario] Error en el modulo de usuarios")
      }
   });

}

module.exports.obtenerUsuario = obtenerUsuario;
