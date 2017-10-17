var request = require('request');
var config = require('../config/config').config;
var moment = require('moment');

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
      console.log("responseeee" + body);
      callback(body);
   });

}

function agregarEvento(inicioHuecoAceptado, guestMail) {

   var agendarUrl = config.calendarioApiUrls.agendar;

   var momentDesde = moment(inicioHuecoAceptado);
   momentHasta = momentDesde.add(1,'hours');

   var evento = {
   	description: "Reunión con " + guestMail,
      fecha_desde: inicioHuecoAceptado.replace(".000Z","-03:00"),
      fecha_hasta: momentHasta.toISOString().replace(".000Z","-03:00")
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
