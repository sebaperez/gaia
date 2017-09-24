var request = require('request');
var config = require('../config/config').config;

function obtenerUsuario(email, callback) {

   var usuarioUrl = config.userApiUrls.clientes + '?filter[where][email]=' + email + '&filter[limit]=1';

   request.get(usuarioUrl, function (error, response, body) {
      callback(JSON.parse(body)[0]);
   });

}

module.exports.obtenerUsuario = obtenerUsuario;
