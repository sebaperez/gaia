var request = require('request');
var config = require('../config/config').config;

function crearConversacion(conversacion, callback) {

   var conversacionesUrl = config.conversacionApiUrls.conversaciones;

   request.post({
      url: conversacionesUrl,
      json: true,
      body: conversacion
   }, function (error, response, body) {

      callback(body);

   });

}

module.exports.crearConversacion = crearConversacion;
