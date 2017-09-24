var request = require('request');
var config = require('../config/config').config;

function obtenerMensajeCoordinacionAGuest(respuestaRequest, callback) {

   var conversacionesUrl = config.respuestaApiUrls.;

   request.post({
      url: conversacionesUrl,
      form: respuestaRequest
   }, function (error, response, body) {

      var parsedBody = JSON.parse(body);

      callback(parsedBody);


   });

}

module.exports.obtenerMensajeCoordinacionAGuest = obtenerMensajeCoordinacionAGuest;
