var request = require('request');
var config = require('../config/config').config;

function obtenerUsuario(emailRemitente, emailDestinatario, callback, err) {

   var usuarioRemitenteUrl = config.userApiUrls.clientes + '?filter[where][email]=' + emailRemitente + '&filter[limit]=1';
   request.get(usuarioRemitenteUrl, function (error, response, body) {
      console.log("Buscando owner entre mails " + emailRemitente);
      if(body){
         var usuarioRemitente = JSON.parse(body)[0];
         if(usuarioRemitente) {
            callback(usuarioRemitente);
         } else {
            console.log("Buscando owner entre mails " + emailDestinatario);
            var usuarioDestinatarioUrl = config.userApiUrls.clientes + '?filter[where][email]=' + emailDestinatario + '&filter[limit]=1';
            request.get(usuarioDestinatarioUrl, function (error, response, body) {
               var usuarioDestinatario = JSON.parse(body)[0];
               if(usuarioDestinatario) {
                  callback(usuarioDestinatario);
               } else {
                  err("No existe un owner con el email " + emailRemitente + " ni " + emailDestinatario);
               }
            });
         }
      } else {
         err("Error en el modulo de clientes")
      }
   });

}

module.exports.obtenerUsuario = obtenerUsuario;
