var request = require('request');
var config = require('../config/config').config;

var conversacionesUrl = config.conversacionApiUrls.conversaciones;

function crearConversacion(ownerMail, guestMail, contenidoMailActual, significado, hueco, callback) {


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
            significado: significado,
            hueco: hueco
         }
      ]
   };

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

function agregarMensajeAConversacion(ownerMail, guestMail, mensaje, callback, err) {
      request.put({
         url: conversacionesUrl + '/' + ownerMail + '/' + guestMail,
         json: true,
         body: {"mensajes": mensaje}
      }, function (error, response, body) {
         if(error){
            err();
         }
         if(callback){
            callback(body);
         }
      });
}

function armarMensajeProponerHorario(respuesta, desde){
   return {
      "contenido": respuesta,
      "intents": [
         "proponer_horario"
      ],
      "intervalos": [{
          "desde": desde
      }]
   }
}

module.exports.crearConversacion = crearConversacion;
module.exports.agregarMensajeAConversacion = agregarMensajeAConversacion;
module.exports.armarMensajeProponerHorario = armarMensajeProponerHorario;
