var request = require('request');
var config = require('../config/config').config;
var log = require('log4js').getLogger();
log.level = 'debug';

var conversacionesUrl = config.conversacionApiUrls.conversaciones;

module.exports.crearConversacion = function (owner, guest, contenidoMailActual, significado, callback) {
   // ej significado: {
   //   "original_response": "PARA DEBUG",
   //   "ok": true,
   //   "intents": [
   //      "solicitar_reunion"
   //   ],
   //   "fechas": [{
   //      "fecha": "2017-08-22T00:00:00.000-03:00"
   //   }],
   //   "intervalos": [
   //     {
   //        "desde": "2017-08-17T00:00:00.000-03:00",
   //        "hasta": "2017-09-02T00:00:00.000-03:00"
   //     }],
   // }

   var nuevaConversacion = {
      owner: owner.email,
      guest: guest.email,
      mensajes: [
         {
            contenido: contenidoMailActual, //solo el ultimo mensaje de la cadena
            significado: significado
         }
      ]
   };
   log.debug('[Conversacion] Creando conversacion ', nuevaConversacion);
   request.post({
      url: conversacionesUrl,
      json: true,
      body: nuevaConversacion
   }, function (error, response, body) {
      if(callback){
         callback(body);
      }
   });
}

module.exports.obtenerUltimaConversacion = function (owner, guest, callback){
   request.get(conversacionesUrl + '/' + owner.email + '/' + guest.email, function (error, response, body) {
      if(callback) {
         var conversacion = JSON.parse(body);
         callback(conversacion);
      }
      if(error){
         log.error("[Conversacion] No se pudo obtener la conversacion entre owner " + owner.email + " y guest " + guest.email);
      }
   });
}

module.exports.agregarMensajeAConversacion = function (owner, guest, mensaje, conversacion, callback, err) {
      conversacion.mensajes = conversacion.mensajes? conversacion.mensajes : [];
      log.debug('[Conversacion] Agregando mensaje', mensaje, "a conversacion con id " + conversacion.id);
      conversacion.mensajes.unshift(mensaje);
      request.put({
         url: conversacionesUrl + '/' + conversacion.id,
         json: true,
         body: conversacion
      }, function (error, response, body) {
         if(error){
            log.error('No pude agregar el mensaje a la conversacion del owner ' + owner.email + ' y guest ' + guest.email);
            err();
         }
         if(callback){
            callback(body);
         }
      });
}

module.exports.armarMensajeProponerHorario = function (respuesta, desde){
   return {
      "contenido": respuesta,
      "significado": {
         "intents": [
            "proponer_horario"
         ],
         "intervalos": [{
            "desde": desde
         }]
      }
   }
}

module.exports.armarMensajeConfirmarReunion = function (respuesta, evento) {
   return {
      "contenido": respuesta,
      "evento": evento,
      "significado": {
         "intents": [
            "confirmar_reunion"
         ],
         "intervalos": [{
            "desde": evento.start.dateTime
         }]
      }
   }
}

module.exports.obtenerUltimoMensajeConSignificado = function (conversacion, significado){
   log.debug("[Conversacion] Buscando mensaje con significado: " + significado + ' entre mensajes ' + JSON.stringify(conversacion.mensajes));
   var mensajesConSignificado = conversacion.mensajes.filter(function(m) {
      return m.significado && m.significado.intents && m.significado.intents.indexOf(significado) > -1;
   })
   if(mensajesConSignificado.length > 0){
      return mensajesConSignificado[0];
   }
   log.info('[Conversacion] Mensaje de propuesta de horario: ', mensajeDePropuesta);
}
