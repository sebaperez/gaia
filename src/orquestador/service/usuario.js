var request = require('request');
var config = require('../config/config').config;
var mailHelper = require('../helpers/mailHelper')
var log = require('log4js').getLogger();
log.level = 'debug';

module.exports.obtenerUsuario = function(botEmail, reject, callback) {
   log.debug("[Usuario] Buscando owner del bot", botEmail);
   var usuarioRemitenteUrl = config.userApiUrls.clientes + '?filter[where][botEmail]=' + botEmail;
   request.get(usuarioRemitenteUrl, function (error, response, body) {
      if(body){
         var owner = JSON.parse(body)[0];
         if(owner) {
            return callback(owner);
         } else{
            reject()
         }
      } else if(error) {
         log.error("[Usuario] Error en el modulo de usuarios")
         return reject()
      } else {
         return reject()
      }
   });
}
