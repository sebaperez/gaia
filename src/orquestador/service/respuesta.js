var request = require('request');
var config = require('../config/config').config;

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

function obtenerMensajeCoordinacionAGuest(owner, hueco, callback) {
   var respuestaUrl = config.respuestaApiUrls.solicitarReunionAlGuest;
   request.post({
      url: respuestaUrl,
      json: true,
      body: {
         owner: owner,
         hueco: hueco
      }
   }, function (error, response, body) {
      callback(body);
   });
}
function obtenerMensajeConfirmacionReunion(owner, hueco, callback){
   var respuestaUrl = config.respuestaApiUrls.confirmarReunion;
   console.log(hueco);
   request.post({
      url: respuestaUrl,
      json: true,
      body: {
         owner: owner,
         hueco: hueco
      }
   }, function (error, response, body) {
      callback(body);
   });
}

module.exports.obtenerMensajeCoordinacionAGuest = obtenerMensajeCoordinacionAGuest;
module.exports.obtenerMensajeConfirmacionReunion = obtenerMensajeConfirmacionReunion;
