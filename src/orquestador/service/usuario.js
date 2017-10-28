var request = require('request');
var config = require('../config/config').config;
var log = require('log4js').getLogger();
log.level = 'debug';

module.exports.obtenerUsuario = function(mail, callback, err) {
   if(mail.cc && mail.cc.value[0]){
      var mailCC = mail.cc.value[0].address
   }
   var mails = [mail.from.value[0].address, mail.to.value[0].address, mailCC]
   log.debug("[Usuario] Buscando owner entre mails", mails);

   for (var i = 0; i < mails.length; i++) {
      if(mails[i]){
         var usuarioRemitenteUrl = config.userApiUrls.clientes + '?filter[where][email]=' + mails[i] + '&filter[limit]=1';
         request.get(usuarioRemitenteUrl, function (error, response, body) {
            if(body){
               var owner = JSON.parse(body)[0];
               if(owner) {
                  return callback(owner);
               }
            }
            if(error) {
               return err("[Usuario] Error en el modulo de usuarios")
            }
         });
      }
   }
}
