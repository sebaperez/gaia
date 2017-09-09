var express = require('express');
var router = express.Router();
var usuarioService = require('../service/usuario');
var iaService = require('../service/ia');
var conversacionService = require('../service/conversacion');

router.post('/', function (req, res, next) {

   usuarioService.obtenerUsuario(req.body.de, function (usuario) {

      iaService.interpretarMensaje(req.body.contenido, function (significado) {

         if(solicitaReunion(significado)){

            var nuevaConversacion = {
               owner: req.body.de,
               guests: req.body.para,
               mensajes: [
                  {
                     contenido: req.body.contenido,
                     significado: significado
                  }
               ]
            };

            conversacionService.crearConversacion(nuevaConversacion, function (conversacionCreada){
               res.send(conversacionCreada);
               //calendarioService.obtenerHueco(significado.intervalos)
               //respuestaService.obtenerMensajeCoordinacionAGuest(nombreGuest, fechaHora)
               //conversacionService.agregarMensaje(conversacionId, textoRespuesta)
               //res.send(mensaje:{de, para, mensaje});
            });

         } else {
            console.log("Flujo todavia no soportado");
         }

      });

   });


});

function solicitaReunion(significado) {
   return significado.intents.indexOf("solicitar_reunion") >= 0;
}

module.exports = router;
