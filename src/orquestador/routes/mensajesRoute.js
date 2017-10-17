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
   // "attachments": [],
   // "headers": {},
   // "html": "<div dir=\"ltr\">teaaegafa ag aeg </div>\n",
   // "text": "teaaegafa ag aeg\n",
   // "textAsHtml": "<p>teaaegafa ag aeg</p>",
   // "subject": "test",
   // "date": "2017-10-08T16:20:00.000Z",
   // "to": {
   //    "value": [
   //         {
   //             "address": "clara@gaiameet.com",
   //             "name": ""
   //         }
   //    ],
   //    "html": "<span class=\"mp_address_group\"><a href=\"mailto:clara@gaiameet.com\" class=\"mp_address_email\">clara@gaiameet.com</a></span>",
   //    "text": "clara@gaiameet.com"
   // },
   // "from": {
   //    "value": [
   //         {
   //             "address": "nicolas.presta@mercadolibre.com",
   //             "name": "Nicolas Rodriguez Presta"
   //         }
   //    ],
   //    "html": "<span class=\"mp_address_group\"><span class=\"mp_address_name\">Nicolas Rodriguez Presta</span> &lt;<a href=\"mailto:nicolas.presta@mercadolibre.com\" class=\"mp_address_email\">nicolas.presta@mercadolibre.com</a>&gt;</span>",
   //    "text": "Nicolas Rodriguez Presta <nicolas.presta@mercadolibre.com>"
   // },
   // "messageId": "<CAEfck2BKvKwU57rO1NBDdMic5EOmHBsRy=Y+aW5p3coYsfXtJQ@mail.gmail.com>"

   var mailRemitente = req.body.from.value.address;
   var mailDestinatario = req.body.to.value.address;
   var asuntoMail = req.body.subject;
   var contenidoMail = req.body.text;
   var contenidoMailActual = req.body.text.split("----------", 1)[0].trim();
   var idMensaje = req.body.messageId;

   usuarioService.obtenerUsuario(mailRemitente, mailDestinatario, function (owner) {
      var ownerMail = owner.email;
      var guestMail = owner.email == mailRemitente? mailDestinatario : mailRemitente;

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
         console.log('Mensaje interpretado: [' + contenidoMailActual + ']');
         console.log("El significado es: " + significado.intents);

         switch(obtenerIntencion(significado)) {

            case 'solicitar_reunion':
               calendarioService.obtenerHueco(significado.fechas, significado.intervalos, owner.id, function(hueco) {
                  if(hueco){
                     conversacionService.crearConversacion(mailRemitente, mailDestinatario, contenidoMailActual, significado, hueco);
                     respuestaService.obtenerMensajeCoordinacionAGuest(owner, hueco, function(respuesta){
                        ioService.enviarMail(owner.botEmail, mailDestinatario, mailRemitente, asuntoMail, idMensaje, respuesta, contenidoMail, function(){
                           res.status(200).send();
                        }, function(){
                           res.status(500).send();
                        });
                        var mensajeDeGaia = conversacionService.armarMensajeProponerHorario(respuesta, hueco);
                        conversacionService.agregarMensajeAConversacion(mailRemitente, mailDestinatario, mensajeDeGaia)
                     });
                  } else {
                     let respuesta = "Lo siento, no hay horarios disponibles para agendar la reunión.";
                     ioService.enviarMail(owner.botEmail, mailDestinatario, mailRemitente, asuntoMail, idMensaje, respuesta, contenidoMail, function(){
                        res.status(200).send();
                     }, function(){
                        res.status(500).send();
                     });
                  }
               }, function(){
                  res.status(500).send();
               });
               break;

            case 'aceptar_reunion':
               conversacionService.agregarMensajeAConversacion(ownerMail, guestMail, contenidoMailActual, function(conversacion){
                  var mensajeDePropuesta = conversacionService.obtenerUltimoMensajeConSignificado(conversacion, "proponer_horario");
                  if(mensajeDePropuesta){
                     var iniciohuecoAceptado = mensajeDePropuesta.intervalos[0].desde;
                     calendarioService.agregarEvento(iniciohuecoAceptado, guestMail);
                     respuestaService.obtenerMensajeConfirmacionReunion(owner, iniciohuecoAceptado, function(respuesta){
                        ioService.enviarMail(owner.botEmail, mailDestinatario, mailRemitente, asuntoMail, idMensaje, respuesta, contenidoMail, function(){
                           res.status(200).send();
                        }, function(){
                           res.status(500).send();
                        });
                        var mensajeDeGaia = conversacionService.armarMensajeConfirmarReunion(respuesta, iniciohuecoAceptado);
                        conversacionService.agregarMensajeAConversacion(mailRemitente, mailDestinatario, mensajeDeGaia);
                     });
                  } else {
                     var respuesta = "Disculpe, no sé a qué reunión se refiere."
                     ioService.enviarMail(owner.botEmail, mailDestinatario, mailRemitente, asuntoMail, idMensaje, respuesta, contenidoMail, function(){
                        res.status(200).send();
                     }, function(){
                        res.status(500).send();
                     });
                  }
               }, function() {
                  console.error('No pude agregar el mensaje a la conversacion del owner ' + ownerMail + ' y guest ' + guestMail);
                  res.status(501);
                  res.send();
               });
               break;

            case 'cancelar_reunion':
               console.warn('Cancelar reunión todavía no implementado.');
               res.status(501);
               res.send();
               break;

            case 'posponer_reunion':
               console.warn('Posponer reunión todavía no implementado.');
               res.status(501);
               res.send();
               break;

            default:
               console.error('Intencion(es) ' + significado.intents + ' no soportadas.');
               res.status(400);
               res.send();
         }
      }, function(mensajeError) {
         console.error(mensajeError);
         res.status(400);
         res.send(mensajeError);
      });
   }, function(mensajeError) {
      console.error(mensajeError);
      res.status(400);
      res.send(mensajeError);
   });
});

function obtenerIntencion (significado) {
   if(significado && significado.intents) {
      return significado.intents[0];
   } else {
      return "desconocida"
   }
}

module.exports = router;
