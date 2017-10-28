var request = require('request');
var config = require('../config/config').config;
var moment = require('moment');
var log = require('log4js').getLogger();
log.level = 'debug';

module.exports.obtenerHueco = function (fechas, intervalos, ownerId, callback, err) {

   var intervalosYFechas = intervalos.slice();
   for (var i = 0; i < fechas.length; i++) {
      intervalosYFechas.push({
         desde: fechas[i].fecha,
         hasta: calcularFechaHasta(fechas[i].fecha)
      });
   }
   log.debug('[Calendario] Intervalos para buscar hueco: ' + JSON.stringify(intervalosYFechas));

   request.post({
      url: config.calendarioApiUrls.huecos,
      json: true,
      body: intervalosYFechas,
      qs: {
         usuario: ownerId
      }
   }, function (error, response, body) {
      if(error || response.statusCode != 200){
         log.error("[Calendario] Hubo un error en el módulo Calendario.");
         err(error);
      } else if (response.statusCode != 200){
         err("[Calendario] Hubo un error en la respuesta del módulo Calendario.");
      } else {
         log.info("[Calendario] Hueco encontrado por el calendario: " + body);
         callback(body);
      }
   });

}

module.exports.agregarEvento = function (ownerId, inicioHuecoAceptado, guestNombre, callback) {
   var agendarUrl = config.calendarioApiUrls.agendar;
   var momentDesde = moment(inicioHuecoAceptado);
   momentHasta = momentDesde.add(1,'hours');
   var evento = {
      description: "Reunión con " + guestNombre,
      fecha_desde: inicioHuecoAceptado,
      fecha_hasta: momentHasta.format('YYYY-MM-DDTHH:mm:ssZ')
   }
   log.debug('[Calendario] Intentando agendar evento: ' + JSON.stringify(evento));
   request.post({
      url: agendarUrl,
      json: true,
      body: evento,
      qs: {
         usuario: ownerId
      }
   }, function (error, response, body) {
      log.info("Evento agendado:", body);
      callback(body);
   });

}

module.exports.eliminarEvento = function(ownerId, eventoId) {
   var eliminarUrl = config.calendarioApiUrls.eliminar;
   log.debug('[Calendario] Intentando eliminar evento: ' + eventoId);
   request.post({
      url: eliminarUrl,
      json: true,
      body: {event_id: eventoId},
      qs: {
         usuario: ownerId
      }
   }, function (error, response, body) {
      log.info("Evento eliminado");
      callback();
   });
}

function calcularFechaHasta(fechaDesde) {
   var momentDesde = moment(fechaDesde);
   var fechaHasta;
   if(momentDesde.hour() == 0){
      // todo el dia
      fechaHasta = momentDesde.add(1,'days').startOf('day').format('YYYY-MM-DDTHH:mm:ssZ')
   } else {
      // un horario específico
      fechaHasta = momentDesde.add(1,'hours').format('YYYY-MM-DDTHH:mm:ssZ')
   }
   log.debug('[Calendario] Calculo de fechaHasta. Desde: ' + fechaDesde + ', Hasta: ' + fechaHasta);
   return fechaHasta;
}
