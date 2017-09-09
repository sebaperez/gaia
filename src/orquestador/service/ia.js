var request = require('request');
var config = require('../config/config')

function interpretarMensaje(contenido, callback) {

   var iaProcessUrl = config.prod ?
   config.iaApiUrl + '/process'
   : 'http://localhost:5555/test/ia';

   request.post({
      url: iaProcessUrl,
      form: {msj: contenido}
   }, function (error, response, body) {

      var parsedBody = JSON.parse(body);

      if(parsedBody.ok){

         callback(body);

      } else {
         console.log("El modulo de IA no pudo procesar el mensaje: " + contenido);
      }

   });

}

module.exports.interpretarMensaje = interpretarMensaje;
