var request = require('request');
var config = require('../config/config').config;

function obtenerUsuario(email, callback, err) {

   var usuarioUrl = config.userApiUrls.clientes + '?filter[where][email]=' + email + '&filter[limit]=1';

   request.get(usuarioUrl, function (error, response, body) {

      var usuario = JSON.parse(body)[0];
      if(usuario) {
         callback(usuario);
      } else {
         err("No existe un owner con el email " + email);
      }

   });

}

module.exports.obtenerUsuario = obtenerUsuario;
