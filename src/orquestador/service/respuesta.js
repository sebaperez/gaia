var request = require('request');
var config = require('../config/config').config;

function obtenerMensajeCoordinacionAGuest(owner, fechas, callback) {

   var respuestaUrl = config.respuestaApiUrls.solicitarReunionAlGuest;

   request.post({
      url: respuestaUrl,
      json: true,
      body: {
         owner: owner,
         fechas: fechas
      }
   }, function (error, response, body) {

      callback(body);

   });

}

module.exports.obtenerMensajeCoordinacionAGuest = obtenerMensajeCoordinacionAGuest;
