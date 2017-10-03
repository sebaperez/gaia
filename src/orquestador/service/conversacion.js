var request = require('request');
var config = require('../config/config').config;

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
      guests: guestMail,
      mensajes: [
         {
            contenido: contenidoMailActual, //solo el ultimo mensaje de la cadena
            significado: significado
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

function obtenerConversacion(idMensaje, callback, err) {
   request.get(conversacionesUrl + '/' + idMensaje, function (error, response, body) {
      if(callback){
         if(error){
            err('No pude obtener la conversacion del mensaje con ID ' + idMensaje);
         } else {
            callback(JSON.parse(body));
         }
      }
   });
}

module.exports.crearConversacion = crearConversacion;
module.exports.obtenerConversacion = obtenerConversacion;
