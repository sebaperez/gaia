var request = require('request');
var config = require('../config/config').config;

function crearConversacion(ownerMail, guestMail, contenidoMailActual, significado, callback) {

   var conversacionesUrl = config.conversacionApiUrls.conversaciones;

   var nuevaConversacion = {
      owner: ownerMail,
      guests: guestMail,
      mensajes: [
         {
            contenido: contenidoMailActual,
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
