var express = require('express');
var router = express.Router();
var usuarioService = require('../service/usuario');
var iaService = require('../service/ia');
var conversacionService = require('../service/conversacion');
var calendarioService = require('../service/calendario');
var respuestaService = require('../service/respuesta');
var ioService = require('../service/io');
var request = require('request');
var config = require('../config/config').config;
var mailHelper = require('../helpers/mailHelper')
var log = require('log4js').getLogger();
log.level = 'debug';

var respuestaDeError = "Lo siento, no estoy disponible en este momento."

router.post('/', function (req, res, next) {

   var mail = req.body;

   log.info('Mensaje recibido: ' + mail.subject);
   log.debug(JSON.stringify(mail));
   var mailRemitente = mail.from.value[0].address;
   var mailDestinatario = mail.to.value[0].address;
   if(mail.cc.value[0]){
      var mailCC = mail.cc.value[0].address;
   }
   var mails = [mailRemitente, mailDestinatario, mailCC]
   var asuntoMail = mail.subject;
   var contenidoMail = mail.text;
   var contenidoMailActual = mail.text.split("----------", 1)[0].trim();
   var idMensaje = mail.messageId;

   usuarioService.obtenerUsuario(mails, function (owner) {
      var ownerMail = owner.email;
      var guestMail = mailHelper.obtenerGuestMail(mails, owner);
      var guestNombre = mailHelper.obtenerGuestNombre(mail, guestMail);

      if(!contenidoMailActual) {
         var mensajeMailVacio = 'Me llegó el mail vacío.'
         log.info(mensajeMailVacio);
         res.send({
            de: owner.botEmail,
            para: mailRemitente,
            asunto: 'Re: ' + asuntoMail,
            contenido: mensajeMailVacio
         })
      }
      log.info('Mensaje recibido: [' + contenidoMailActual + ']');
      iaService.interpretarMensaje(contenidoMailActual, function (significado) {
         log.info("El significado es: [" + significado.intents + "]");

         switch(mailHelper.obtenerIntencion(significado)) {

            case 'solicitar_reunion':
               //cubre sólo el caso en el que el owner pide la reunión al guest copiando a gaia
               calendarioService.obtenerHueco(significado.fechas, significado.intervalos, owner.id, function(horario) {
                  if(horario){
                     conversacionService.crearConversacion(ownerMail, guestMail, contenidoMailActual, significado);
                     respuestaService.obtenerMensajeCoordinacionAGuest(guestNombre, horario, function(respuesta){
                        ioService.enviarMail(owner.botEmail, guestMail, ownerMail, asuntoMail, idMensaje, respuesta, contenidoMail, function(){
                           return res.status(200).send();
                        }, function(){ return res.status(500).send() });
                        var mensajeDeGaia = conversacionService.armarMensajeProponerHorario(respuesta, horario);
                        conversacionService.agregarMensajeAConversacion(ownerMail, guestMail, mensajeDeGaia)
                     });
                  } else {
                     let respuesta = "Lo siento, no hay horarios disponibles para agendar la reunión.";
                     ioService.enviarMail(owner.botEmail, guestMail, ownerMail, asuntoMail, idMensaje, respuesta, contenidoMail, function(){
                        return res.status(200).send();
                     }, function(){ return res.status(500).send() });
                  }
               }, function(error){
                  log.error(error);
                  ioService.enviarMail(owner.botEmail, guestMail, ownerMail, asuntoMail, idMensaje, respuestaDeError, contenidoMail, function(){
                     return res.status(200).send();
                  }, function(){ return res.status(500).send() });
               });
               break;

            case 'aceptar_reunion':
               conversacionService.agregarMensajeAConversacion(ownerMail, guestMail, contenidoMailActual, function(conversacion){
                  var mensajeDePropuesta = conversacionService.obtenerUltimoMensajeConSignificado(conversacion, "proponer_horario");
                  log.info('Mensaje de propuesta de horario: ', mensajeDePropuesta);
                  if(mensajeDePropuesta){
                     var iniciohuecoAceptado = mensajeDePropuesta.significado.intervalos[0].desde;
                     calendarioService.agregarEvento(owner.id, iniciohuecoAceptado, guestNombre || guestMail);
                     respuestaService.obtenerMensajeConfirmacionReunion(owner, iniciohuecoAceptado, function(respuesta){
                        ioService.enviarMail(owner.botEmail, guestMail, ownerMail, asuntoMail, idMensaje, respuesta, contenidoMail, function(){
                           return res.status(200).send();
                        }, function() {return res.status(500).send()});
                        var mensajeDeGaia = conversacionService.armarMensajeConfirmarReunion(respuesta, iniciohuecoAceptado);
                        conversacionService.agregarMensajeAConversacion(ownerMail, guestMail, mensajeDeGaia);
                     });
                  } else {
                     var respuesta = "Disculpe, no sé a qué reunión se refiere."
                     ioService.enviarMail(owner.botEmail, guestMail, ownerMail, asuntoMail, idMensaje, respuesta, contenidoMail, function(){
                        return res.status(200).send();
                     }, function(){return res.status(500).send()});
                  }
               }, function() {
                  log.error('No pude agregar el mensaje a la conversacion del owner ' + ownerMail + ' y guest ' + guestMail);
                  return res.status(500).send();
               });
               break;

            case 'cancelar_reunion':
               log.warn('Cancelar reunión todavía no implementado.');
               return res.status(501).send();
               break;

            case 'posponer_reunion':
               log.warn('Posponer reunión todavía no implementado.');
               return res.status(501).send();
               break;

            default:
               log.error('Intencion(es) ' + significado.intents + ' no soportadas.');
               return res.status(400).send();
         }

      }, function(mensajeError) {
         log.error(mensajeError);
         ioService.enviarMail(owner.botEmail, ownerMail, guestMail, asuntoMail, idMensaje, respuestaDeError, contenidoMail, function(){
            return res.status(200).send();
         }, function(){return res.status(500).send()});
      });

   }, function(mensajeError) {
      log.error(mensajeError);
      ioService.enviarMail(owner.botEmail, ownerMail, guestMail, asuntoMail, idMensaje, respuestaDeError, contenidoMail, function(){
         return res.status(200).send();
      }, function(){return res.status(500).send()});
   });
});


module.exports = router;
