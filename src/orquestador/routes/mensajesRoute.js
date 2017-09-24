var express = require('express');
var router = express.Router();
var usuarioService = require('../service/usuario');
var iaService = require('../service/ia');
var conversacionService = require('../service/conversacion');
var calendarioService = require('../service/calendario');
var respuestaService = require('../service/respuesta');

router.post('/', function (req, res, next) {

   var ownerMail = req.body.de;
   var guestMail = req.body.para;
   var asuntoMail = req.body.asunto;
   var contenidoMailActual = req.body.contenidoActual;
   var contenidoMail = req.body.contenido;

   usuarioService.obtenerUsuario(ownerMail, function (owner) {

      iaService.interpretarMensaje(contenidoMailActual, function (significado) {

         if(solicitaReunion(significado)){

            conversacionService.crearConversacion(ownerMail, guestMail, contenidoMailActual, significado);

            calendarioService.obtenerHueco(significado.intervalos, function(hueco) {

               respuestaService.obtenerMensajeCoordinacionAGuest(owner, hueco, function(respuesta){
                  console.log(owner)
                  res.send({
                     de: owner.botEmail, //validar cómo sale de usuarioApi
                     para: guestMail,
                     asunto: asuntoMail,
                     contenido: respuesta.contenido + "\n\n" + contenidoMailActual + "\n\n" + contenidoMail
                  });

               });

            });

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
