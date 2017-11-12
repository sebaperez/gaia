var express = require('express');
var router = express.Router();
var orquestadorService = require("../service/orquestador")
var usuarioService = require('../service/usuario');
var ioService = require('../service/io');
var conversacionService = require('../service/conversacion');
var iaService = require('../service/ia');
var mailHelper = require('../helpers/mailHelper')
var log = require('log4js').getLogger();
log.level = 'debug';

router.post('/', function (req, res, next) {

   var mail = req.body;
   log.info('[Route] Mensaje recibido: ' + mail.subject);
   var botEmail = mailHelper.extraerBotEmail(mail)

   usuarioService.obtenerUsuario(botEmail, function() {
      ioService.responderMail(botEmail, mail.from.value[0].address, null, "Creo que se confundió de mail", mail);
      res.status(400).send("No se encontró el usuario")

   }, function (owner) {
      var guest = mailHelper.extraerGuest(owner, mail)
      if(owner.blacklistedContacts.indexOf(guest.email) > -1) {
         return orquestadorService.redirigirAOwner(owner, mail, 'Esta dirección está incluida dentro de la blacklist. Comuníquese directamente o elimine el mail de la blacklist')
      }
      var contenidoMailActual = mailHelper.extraerContenidoMailActual(mail);
      if(!contenidoMailActual) {
         return orquestadorService.responderTexto(owner, mail, 'Me llegó el mail vacío.')
      }
      log.debug('[Route] Contenido recibido: [' + contenidoMailActual + ']');

      iaService.interpretarMensaje(contenidoMailActual, function() {
         orquestadorService.responderTexto(owner, mail, "Disculpe, no entendí lo que quiso decir")
         res.status(400).send("No se pudo identificar la intención")

      }, function (significado) {
         log.info("[Route] La intencion del mensaje: [" + significado.intents + "]");
         conversacionService.obtenerUltimaConversacion(owner, guest, function() {
            orquestadorService.responderTexto(owner, mail, "Lo siento, no estoy disponible en este momento.");
         }, function(ultimaConversacion) {
            loggearInfoConversacion(ultimaConversacion)

            switch(mailHelper.obtenerIntencion(significado)) {

               case 'solicitar_reunion':
               res.status(200).send("Mensaje recibido. Intención: solicitar_reunion")
               if(ultimaConversacion && ultimaConversacion.abierto){
                  orquestadorService.proponerNuevoHorarioReunion(owner, guest, mail, significado, ultimaConversacion)
               } else {
                  orquestadorService.proponerNuevaReunion(owner, guest, mail, significado)
               }
               break;

               case 'aceptar_reunion':
               res.status(200).send("Mensaje recibido. Intención: aceptar_reunion")
               if(ultimaConversacion && ultimaConversacion.abierto) {
                  orquestadorService.confirmarReunion(owner, guest, mail, significado, ultimaConversacion)
               } else {
                  orquestadorService.responderTexto(owner, mail, "Disculpe, no sé a qué reunión se refiere.");
               }
               break;

               case 'cancelar_reunion':
               res.status(200).send("Mensaje recibido. Intención: cancelar_reunion")
               if(ultimaConversacion){
                  if(ultimaConversacion.abierto){
                     orquestadorService.rechazarHorarioReunion(owner, guest, mail, significado, ultimaConversacion)
                  } else {
                     orquestadorService.cancelarReunionAgendada(owner, guest, mail, significado, ultimaConversacion)
                  }
               }
               break;

               case 'posponer_reunion':
               res.status(200).send("Mensaje recibido. Intención: posponer_reunion")
               log.warn('[Route] Posponer reunión todavía no implementado.');
               errorResponse()
               break;

               default:
               res.status(400).send("No se pudo identificar la intención")
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
