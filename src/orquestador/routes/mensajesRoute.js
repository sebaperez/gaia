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


router.post('/', function (req, res, next) {

   //ej mailParseado:
   // headers – a Map object with lowercase header keys
   // subject is the subject line (also available from the header mail.headers.get(‘subject’))
   // from is an address object for the From: header
   // to is an address object for the To: header
   // cc is an address object for the Cc: header
   // bcc is an address object for the Bcc: header (usually not present)
   // date is a Date object for the Date: header
   // messageId is the Message-ID value string
   // inReplyTo is the In-Reply-To value string
   // reply-to is an address object for the Cc: header
   // references is an array of referenced Message-ID values
   // html is the HTML body of the message. If the message included embedded images as cid: urls then these are all replaced with base64 formatted data: URIs
   // text is the plaintext body of the message
   // textAsHtml is the plaintext body of the message formatted as HTML
   // attachments

   var mailRemitente = req.body.from.value.address;
   var mailDestinatario = req.body.to.value.address;
   var asuntoMail = req.body.subject;
   var contenidoMail = req.body.text;
   var contenidoMailActual = req.body.text.split("----------", 1)[0].trim();
   var idMensaje = req.body.messageId;
   var idMensajeAnterior = req.body.inReplyTo;

   usuarioService.obtenerUsuario(mailRemitente, mailDestinatario, function (owner) {
      if(!contenidoMailActual) {
         var mensajeMailVacio = 'Me llegó el mail vacío.'
         console.error(mensajeMailVacio);
         res.send({
            de: owner.botEmail,
            para: mailRemitente,
            asunto: 'Re: ' + asuntoMail,
            contenido: mensajeMailVacio
         })
      }
      iaService.interpretarMensaje(contenidoMailActual, function (significado) {

         if(solicitaReunion(significado)){
            calendarioService.obtenerHueco(significado.intervalos, function(hueco) {
               conversacionService.crearConversacion(mailRemitente, mailDestinatario, contenidoMailActual, significado);

               //TODO necesito guardar el hueco en el mensaje para obtenerlo despues
               respuestaService.obtenerMensajeCoordinacionAGuest(owner, hueco, function(respuesta){
                  var mailRespuesta = {
                     from: owner.botEmail, //validar cómo sale de usuarioApi
                     to: mailDestinatario,
                     cc: mailRemitente,
                     subject: 'Re: ' + asuntoMail,
                     inReplyTo: idMensaje,
                     text: respuesta + "\n\n" + contenidoMail
                  }
                  ioService.enviarMail(mailRespuesta, res);
               });
            });
         } else if (aceptaReunion(significado)) {

            conversacionService.obtenerConversacion(idMensajeAnterior, function(conversacion){
               //TODO necesito traerme el ultimo mensaje de la conversacion para ver el hueco
               conversacionService.agregarMensajeAConversacion(conversacion.id, contenidoMailActual, significado);
               //TODO guardar el mensaje nuevo con su intencion
               var huecoAceptado = conversacion.mensajes[0].hueco;
               respuestaService.obtenerMensajeConfirmacionReunion(owner, huecoAceptado, function(respuesta){
                  //TODO
                  var mailRespuesta = {
                     from: owner.botEmail, //validar cómo sale de usuarioApi
                     to: mailDestinatario,
                     cc: mailRemitente,
                     subject: 'Re: ' + asuntoMail,
                     inReplyTo: idMensaje,
                     text: respuesta + "\n\n" + contenidoMail
                  }
                  ioService.enviarMail(mailRespuesta, res);
               });
            }, function(error) {
               console.error(error);
               res.status(501);
               res.send();
            });

         } else {
               console.error('Intenciones ' + significado.intents + 'no soportadas.');
               res.status(501);
               res.send();
         }
      });

   }, function(mensajeError){
      res.status(400);
      res.send(mensajeError);
   });


});

function solicitaReunion(significado) {
   return chequearContieneIntencion("solicitar_reunion");
}

function aceptaReunion(significado) {
   return chequearContieneIntencion("aceptar_reunion");
}

function chequearContieneIntencion (nombreIntencion) {
   if(significado && significado.intents){
      return significado.intents.indexOf(nombreIntencion) >= 0;
   } else {
      return false;
   }
}

module.exports = router;
