var express = require('express');
var router = express.Router();
var orquestadorService = require("../service/orquestador")
var usuarioService = require('../service/usuario');
var conversacionService = require('../service/conversacion');
var iaService = require('../service/ia');
var mailHelper = require('../helpers/mailHelper')
var log = require('log4js').getLogger();
log.level = 'debug';

router.post('/', function (req, res, next) {

   var mail = req.body;
   log.info('[Route] Mensaje recibido: ' + mail.subject);
   res.status(200).send("Mensaje recibido [" + mail.subject + "]")
   var botEmail = mailHelper.extraerBotEmail(mail)

   usuarioService.obtenerUsuario(botEmail, function() {
      ioService.responderMail(botEmail, mail.from.value[0].address, null, "Creo que se confundió de mail", mail);

   }, function (owner) {
      var guest = mailHelper.extraerGuest(owner, mail)
      var contenidoMailActual = mailHelper.extraerContenidoMailActual(mail);
      if(!contenidoMailActual) {
         return orquestadorService.responderTexto(owner, mail, 'Me llegó el mail vacío.')
      }
      log.debug('[Route] Contenido recibido: [' + contenidoMailActual + ']');

      iaService.interpretarMensaje(contenidoMailActual, function() {
         orquestadorService.responderTexto(owner, mail, "Disculpe, no entendí lo que quiso decir")

      }, function (significado) {
         log.info("[Route] La intencion del mensaje: [" + significado.intents + "]");
         conversacionService.obtenerUltimaConversacion(owner, guest, function() {
            orquestadorService.responderTexto(owner, mail, "Lo siento, no estoy disponible en este momento.");
         }, function(ultimaConversacion) {
            loggearInfoConversacion(ultimaConversacion)

            switch(mailHelper.obtenerIntencion(significado)) {

               case 'solicitar_reunion':
               if(ultimaConversacion && ultimaConversacion.abierto){
                  orquestadorService.proponerNuevoHorarioReunion(owner, guest, mail, significado, ultimaConversacion)
               } else {
                  orquestadorService.proponerHorarioReunion(owner, guest, mail, significado)
               }
               break;

               case 'aceptar_reunion':
               if(ultimaConversacion && ultimaConversacion.abierto) {
                  orquestadorService.confirmarReunion(owner, guest, mail, significado, ultimaConversacion)
               } else {
                  orquestadorService.responderTexto(owner, mail, "Disculpe, no sé a qué reunión se refiere.");
               }
               break;

               case 'cancelar_reunion':
               if(ultimaConversacion){
                  if(ultimaConversacion.abierto){
                     orquestadorService.rechazarHorarioReunion(owner, guest, mail, significado, ultimaConversacion)
                  } else {
                     orquestadorService.cancelarReunionAgendada(owner, guest, mail, significado, ultimaConversacion)
                  }
               }
               break;

               case 'posponer_reunion':
               log.warn('[Route] Posponer reunión todavía no implementado.');
               errorResponse()
               break;

               default:
               log.error('[Route] Intencion(es) ' + significado.intents + ' no soportadas.');
               orquestadorService.responderTexto(owner, mail, "Disculpe, no entendí lo que quiso decir")
            }
         })

      });

   })
});

function loggearInfoConversacion(conversacion){
   if(conversacion){
      log.debug("[Route] Ultima conversacion id:", conversacion.id)
      log.debug("[Route] Ultima conversacion abierta?", conversacion.abierto)
   } else {
      log.debug("[Route] No hay conversaciones anteriores")
   }
}

module.exports = router;
