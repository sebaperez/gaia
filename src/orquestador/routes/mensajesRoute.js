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

   if(!contenidoMailActual) {
      res.send({
         de: owner.botEmail,
         para: mailDestinatario,
         asunto: asuntoMail,
         contenido: "Me llegó el mail vacío"
      })
   }

   usuarioService.obtenerUsuario(mailRemitente, mailDestinatario, function (owner) {

      iaService.interpretarMensaje(contenidoMailActual, function (significado) {

         if(solicitaReunion(significado)){
            conversacionService.crearConversacion(mailRemitente, mailDestinatario, contenidoMailActual, significado);

            calendarioService.obtenerHueco(significado.intervalos, function(hueco) {

               respuestaService.obtenerMensajeCoordinacionAGuest(owner, hueco, function(respuesta){
                  var mailRespuesta = {
                     from: owner.botEmail, //validar cómo sale de usuarioApi
                     to: mailDestinatario,
                     cc: owner.email,
                     subject: asuntoMail,
                     inReplyTo: idMensaje,
                     text: respuesta + "\n\n" + contenidoMail
                  }
                  ioService.enviarMail(mailRespuesta, res);
               });

            });
         } else {
            console.error('Flujo todavia no soportado. ', error);
            res.status(501);
         }
      });

   }, function(mensajeError){
      res.status(400);
      res.send(mensajeError);
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
