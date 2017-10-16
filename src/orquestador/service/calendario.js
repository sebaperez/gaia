var request = require('request');
var config = require('../config/config').config;

function obtenerHueco(intervalos, ownerId, callback, err) {

   var huecosUrl = config.calendarioApiUrls.huecos;
   request.post({
      url: huecosUrl,
      json: true,
      body: intervalos,
      qs: {
         usuario: ownerId
      }
   }, function (error, response, body) {
      if(response.status != 200){
         err();
      } else {
         callback(body);
      }
   });

}

function agregarEvento(inicioHuecoAceptado, guestMail) {

   var agendarUrl = config.calendarioApiUrls.agendar;
   var evento = {
   	description: "Reunión con " + guestMail,
      fecha_desde: inicioHuecoAceptado,
      fecha_hasta: "YYYY-MM-DDTHH:00:00-03:00"
   }

   request.post({
      url: agendarUrl,
      json: true,
      body: body,
      qs: {
         usuario: ownerId
      }
   }, function (error, response, body) {
      console.log("Evento agendado: " + evento);
   });

}

module.exports.obtenerHueco = obtenerHueco;
module.exports.agregarEvento = agregarEvento;
