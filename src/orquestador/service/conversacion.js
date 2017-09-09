var request = require('request');
var config = require('../config/config').config;

function crearConversacion(conversacion, callback) {

   var conversacionesUrl = config.conversacionApiUrls.conversaciones;

   request.post({
      url: conversacionesUrl,
      form: conversacion
   }, function (error, response, body) {

      var parsedBody = JSON.parse(body);

      callback(parsedBody);


   });

}

module.exports.crearConversacion = crearConversacion;
