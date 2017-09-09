var request = require('request');
var config = require('../config/config')

function obtenerUsuario(email, callback) {

   var usuarioUrl = config.prod ?
    config.userApiUrl + '/clients?filter[where][username]=' + email + '&filter[limit]=1'
    : 'http://localhost:5555/test/user';

   request.get(usuarioUrl, function (error, response, body) {
      callback(body);
   });

}

module.exports.obtenerUsuario = obtenerUsuario;
