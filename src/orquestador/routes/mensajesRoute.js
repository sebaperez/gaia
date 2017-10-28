var express = require('express');
var router = express.Router();
var orquestadorService = require("../service/orquestador")
var usuarioService = require('../service/usuario');
var iaService = require('../service/ia');

var request = require('request');
var config = require('../config/config').config;
var mailHelper = require('../helpers/mailHelper')
var log = require('log4js').getLogger();
log.level = 'debug';

router.post('/', function (req, res, next) {

   var mail = req.body;
   log.info('Mensaje recibido: ' + mail.subject);
   log.debug(JSON.stringify(mail));

   usuarioService.obtenerUsuario(mail, function (owner) {
      var guest = mailHelper.obtenerGuest(owner, mail)

      var contenidoMailActual = mailHelper.obtenerContenidoMailActual(mail);
      if(!contenidoMailActual) {
         orquestadorService.responderAMailVacio(owner, mail, function(){
            return res.status(200).send()
         }, function(){
            return res.status(500).send()
         })
      }
      log.info('Contenido recibido: [' + contenidoMailActual + ']');
      iaService.interpretarMensaje(contenidoMailActual, function (significado) {
         log.info("El significado es: [" + significado.intents + "]");

         switch(mailHelper.obtenerIntencion(significado)) {

            case 'solicitar_reunion':
               orquestadorService.solicitarReunion(owner, guest, mail, significado, function(){
                  return res.status(200).send()
               }, function(){
                  return res.status(500).send()
               })
               break;

            case 'aceptar_reunion':
               orquestadorService.aceptarReunion(owner, guest, mail, significado, function(){
                  return res.status(200).send()
               }, function(){
                  return res.status(500).send()
               })
               break;

            case 'cancelar_reunion':
               log.warn('Cancelar reunión todavía no implementado.');
               return res.status(501).send()
               break;

            case 'posponer_reunion':
               log.warn('Posponer reunión todavía no implementado.');
               return res.status(501).send()
               break;

            default:
               log.error('Intencion(es) ' + significado.intents + ' no soportadas.');
               return res.status(400).send()
         }

      }, function(mensajeError) {
         log.error(mensajeError);
         ioService.enviarMail(owner.botEmail, owner.email, guest.email, mail.subject, mail.messageId, respuestaDeError, mail.text, function(){
            return res.status(200).send()
         }, function(){
            return res.status(500).send()
         });
      });

   }, function(mensajeError) {
      log.error(mensajeError)
      return res.status(500).send(mensajeError)
   });
});


module.exports = router;
