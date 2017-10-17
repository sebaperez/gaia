var request = require('request');
var config = require('../config/config').config;
var moment = require('moment');

function obtenerHueco(fechas, intervalos, ownerId, callback, err) {

   var huecosUrl = config.calendarioApiUrls.huecos;

   for (var i = 0; i < fechas.length; i++) {
      intervalos.push({
         desde: fechas[i].fecha,
         hasta: calcularFechaHasta(fechas[i].fecha)
      });
   }

   request.post({
      url: huecosUrl,
      json: true,
      body: intervalos,
      qs: {
         usuario: 300
         //usuario: ownerId
      }
   }, function (error, response, body) {
      console.log("hueco encontrado por el calendario: " + body);
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

function calcularFechaHasta(fechaDesde) {
   var momentDesde = moment(fechaDesde);
   if(momentDesde.hour() == 0){
      momentHasta = momentDesde.add(1,'days').startOf('day');
   } else {
      momentHasta = momentDesde.add(1,'hours');
   }
   return momentHasta.toISOString().replace(".000Z","-03:00");
}

module.exports.obtenerHueco = obtenerHueco;
module.exports.agregarEvento = agregarEvento;
