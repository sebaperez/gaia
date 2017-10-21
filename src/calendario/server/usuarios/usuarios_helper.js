var request = require('request');
var log = require('log4js').getLogger();
log.level = 'debug';

exports.obtenerUsuario = function(id, callback, err){
   var usuarioUrl = 'http://45.55.187.250:3000/api/Clients/' + id;
   log.debug("[Usuario] Buscando usuario en URL: " + usuarioUrl);
   request.get(usuarioUrl, function (error, response, body) {
      if(error){
         log.error("[Usuario] Error en el modulo de usuarios");
         err(error);
      } else {
         if(response.statusCode == 200){
            log.debug("[Usuario] Usuario encontrado:", JSON.parse(body));
            callback(JSON.parse(body));
         } else {
            err(JSON.parse(body))
         }
      }
   });
}
