var request = require('request');
var config = require('../config/config').config;
var log = require('log4js').getLogger();
log.level = 'debug';

// ej owner: {
//     "name": "Sebastian",
//     "lastname": "Perez",
//     "botName": "Gaia",
//     "botEmail": "gaia@gaiameet.com",
//     "creationDate": "2017-09-19T16:30:01.315Z",
//     "email": "sebalanus@gmail.com",
//     "id": "59c14609ff49692cd6ba21d1"
//   }

// ej fechas: [
//    "2017-08-22T00:00:00.000-03:00"
// ]

module.exports.obtenerMensajeCoordinacionAGuest = function (guest, hueco, reject, callback) {
   var respuestaUrl = config.respuestaApiUrls.solicitarReunionAlGuest;
   request.post({
      url: respuestaUrl,
      json: true,
      body: {
         nombre: guest.name,
         hueco: hueco
      }
   }, function (error, response, body) {
      if (reject && (error || response.statusCode != 200)) {
         reject(error || response.statusMessage)
      } else {
         if(callback){
            callback(body)
         }
      }
   });
}

module.exports.obtenerMensajeConfirmacionReunion = function (owner, hueco, reject, callback){
   var respuestaUrl = config.respuestaApiUrls.confirmarReunion;
   log.debug('[Respuesta] Armando mensaje de confirmacion de reunion para owner con hueco', hueco);
   request.post({
      url: respuestaUrl,
      json: true,
      body: {
         owner: owner,
         hueco: hueco
      }
   }, function (error, response, body) {
      if (reject && (error || response.statusCode != 200)) {
         reject(error || response.statusMessage)
      } else {
         if(callback){
            callback(body)
         }
      }
   });
}

module.exports.obtenerRespuestaCancelacionReunion = function(evento, reject, callback){
   if(callback){
      callback("Quedó cancelada la reunión del día " + evento.start.dateTime);
   }
}
