var request = require('request');
var config = require('../config/config').config;

function crearConversacion(ownerMail, guestMail, contenidoMailActual, significado, callback) {

   var conversacionesUrl = config.conversacionApiUrls.conversaciones;

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

module.exports.crearConversacion = crearConversacion;
