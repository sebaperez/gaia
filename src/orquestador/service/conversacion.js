var request = require('request');
var config = require('../config/config').config;
var log = require('log4js').getLogger();
log.level = 'debug';

var conversacionesUrl = config.conversacionApiUrls.conversaciones;

module.exports.crearConversacion = function (owner, guest, contenidoMensaje, significado, reject, callback) {
   var nuevaConversacion = {
      owner: owner.email,
      guest: guest.email,
      abierto: true,
      mensajes: [{
         contenido: contenidoMensaje,
         significado: significado
      }]
   };
   log.debug('[Conversacion] Creando conversacion: ', nuevaConversacion);
   request.post({
      url: conversacionesUrl,
      json: true,
      body: nuevaConversacion
   }, function (error, response, body) {
      if (reject && (error || response.statusCode != 201)) {
         reject(error || response.statusMessage)
      } else {
         if(callback) {
            callback(body)
         }
      }
   });
}

module.exports.obtenerUltimaConversacion = function (owner, guest, reject, callback){
   request.get(conversacionesUrl + '/' + owner.email + '/' + guest.email, function (error, response, body) {
      if (reject && (error || (response.statusCode != 200 && response.statusCode != 404))) {
         log.error("[Conversacion] No se pudo obtener la conversacion entre owner " + owner.email + " y guest " + guest.email);
         reject(error || response.statusMessage)
      } else {
         if(body){
            if(callback){
               callback(JSON.parse(body))
            }
         } else {
            callback(null)
         }
      }
   });
}

module.exports.agregarMensajeAConversacion = function (mensaje, conversacion) {
   conversacion.mensajes = conversacion.mensajes ? conversacion.mensajes : [];
   log.debug('[Conversacion] Agregando mensaje', mensaje, "a conversacion con id " + conversacion.id);
   conversacion.mensajes.unshift(mensaje);
   return conversacion;
}

module.exports.actualizarConversacion = function(conversacion, reject, callback){
   request.put({
      url: conversacionesUrl + '/' + conversacion.id,
      json: true,
      body: conversacion
   }, function (error, response, body) {
      if (reject && (error || response.statusCode != 200)) {
         log.error('No pude agregar el mensaje a la conversacion del owner ' + owner.email + ' y guest ' + guest.email);
         reject(error || response.statusMessage)
      } else {
         if(callback){
            callback(body)
         }
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
         "intents": ["confirmar_reunion"],
         "intervalos": [{
            "desde": evento.start.dateTime
         }]
      }
   }
}

module.exports.armarMensajeCancelacionReunion = function (respuesta, evento) {
   return {
      "contenido": respuesta,
      "evento": evento,
      "significado": {
         "intents": ["confirmar_cancelacion"],
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
      log.info('[Conversacion] Mensaje de propuesta de horario: ', mensajesConSignificado[0].contenido);
      return mensajesConSignificado[0];
   } else {
      return null;
   }
}
