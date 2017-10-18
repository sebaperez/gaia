var request = require('request');
var config = require('../config/config').config;
var log = require('log4js').getLogger();
log.level = 'debug';

var conversacionesUrl = config.conversacionApiUrls.conversaciones;

function crearConversacion(ownerMail, guestMail, contenidoMailActual, significado, callback) {


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
      owner: ownerMail,
      guest: guestMail,
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

function obtenerConversacion (ownerMail, guestMail, callback){
   request.get(conversacionesUrl + '/' + ownerMail + '/' + guestMail, function (error, response, body) {
       var conversacion = JSON.parse(body);
      if(callback) {
         callback(conversacion);
      }
      if(error){
         log.error("[Conversacion] No se pudo obtener la conversacion de owner " + ownerMail + " y guest " + guestMail);
      }
   });
}

function agregarMensajeAConversacion(ownerMail, guestMail, mensaje, callback, err) {
   obtenerConversacion(ownerMail, guestMail, function(conversacion) {
      conversacion.mensajes = conversacion.mensajes? conversacion.mensajes : [];
      log.debug('[Conversacion] Agregando mensaje', mensaje, "a conversacion con id " + conversacion.id);
      conversacion.mensajes.push(mensaje);
      request.put({
         url: conversacionesUrl + '/' + conversacion.id,
         json: true,
         body: conversacion
      }, function (error, response, body) {
         if(error){
            err();
         }
         if(callback){
            callback(body);
         }
      });
   });
}

function armarMensajeProponerHorario(respuesta, desde){
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

function armarMensajeConfirmarReunion (respuesta, desde) {
   return {
      "contenido": respuesta,
      "significado": {
         "intents": [
            "confirmar_reunion"
         ],
         "intervalos": [{
            "desde": desde
         }]
      }
   }
}

function obtenerUltimoMensajeConSignificado(conversacion, significado){
   log.debug("[Conversacion] Buscando mensaje con significado: " + significado + ' entre mensajes ' + JSON.stringify(conversacion.mensajes));
   var mensajesConSignificado = conversacion.mensajes.filter(function(m) {
      return m.significado && m.significado.intents && m.significado.intents.indexOf(significado) > -1;
   })
   if(mensajesConSignificado.length > 0){
      return mensajesConSignificado[0];
   }
}

module.exports.obtenerConversacion = obtenerConversacion;
module.exports.crearConversacion = crearConversacion;
module.exports.agregarMensajeAConversacion = agregarMensajeAConversacion;
module.exports.armarMensajeProponerHorario = armarMensajeProponerHorario;
module.exports.armarMensajeConfirmarReunion = armarMensajeConfirmarReunion;
module.exports.obtenerUltimoMensajeConSignificado = obtenerUltimoMensajeConSignificado;
