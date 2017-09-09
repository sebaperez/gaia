var request = require('request');
var config = require('../config/config').config;

function obtenerUsuario(email, callback) {

   var usuarioUrl = config.userApiUrls.clientes + '?filter[where][username]=' + email + '&filter[limit]=1';

   request.get(usuarioUrl, function (error, response, body) {
      callback(body);
   });

}

module.exports.obtenerUsuario = obtenerUsuario;
