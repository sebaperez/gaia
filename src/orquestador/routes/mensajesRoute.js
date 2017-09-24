var express = require('express');
var router = express.Router();
var usuarioService = require('../service/usuario');
var iaService = require('../service/ia');
var conversacionService = require('../service/conversacion');
var calendarioService = require('../service/calendario');

router.post('/', function (req, res, next) {

   var ownerMail = req.body.de;
   var guestMail = req.body.para;
   var asuntoMail = req.body.asunto;
   var contenidoMailActual = req.body.contenidoActual;
   var contenidoMail = req.body.contenido;

   usuarioService.obtenerUsuario(ownerMail, function (usuario) {

      iaService.interpretarMensaje(contenidoMailActual, function (significado) {

         if(solicitaReunion(significado)){

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

            conversacionService.crearConversacion(nuevaConversacion, function (){

            });

            calendarioService.obtenerHueco(significado.intervalos, function(hueco){

               res.send(hueco);

            });


            // var respuestaRequest = {
            //    owner: {
            //       nombre: usuario.name,
            //       email: usuario.email
            //    },
            //    fechas: hueco.fechas
            // };
            //
            // respuestaService.obtenerMensajeCoordinacionAGuest(respuestaRequest, function(respuesta){
            //    var contenidoMailRespuesta = respuesta.contenido + contenidoMail;
            //    res.send({
            //       de: usuario.botEmail, //validar cómo sale de usuarioApi
            //       para: guestMail,
            //       asunto: asuntoMail,
            //       contenido: contenidoMailRespuesta
            //    });
            // });


         } else {
            console.log("Flujo todavia no soportado.");
         }

      });

   });


});

function solicitaReunion(significado) {
   if(significado && significado.intents){
      return significado.intents.indexOf("solicitar_reunion") >= 0;
   } else {
      return false;
   }
}

module.exports = router;
