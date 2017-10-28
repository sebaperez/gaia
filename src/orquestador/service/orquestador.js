var mailHelper = require('../helpers/mailHelper')
var conversacionService = require('../service/conversacion');
var calendarioService = require('../service/calendario');
var respuestaService = require('../service/respuesta');
var ioService = require('../service/io');
var log = require('log4js').getLogger();
log.level = 'debug';

var respuestaDeError = "Lo siento, no estoy disponible en este momento."

module.exports.responderAMailVacio = function(owner, mail, callback, error){
   var mailRemitente = mail.from.value[0].address;
   var mensajeMailVacio = 'Me llegó el mail vacío.'
   log.info(mensajeMailVacio);
   ioService.enviarMail(owner.botEmail, mailRemitente, null, mail.subject, mail.messageId, mensajeMailVacio, mail.text, callback, error);
}

module.exports.solicitarReunion = function(owner, guest, mail, significado, callback, error){
   //cubre sólo el caso en el que el owner pide la reunión al guest copiando a gaia
   calendarioService.obtenerHueco(significado.fechas, significado.intervalos, owner.id, function(horario) {
      if(horario){
         var contenidoMailActual = mailHelper.obtenerContenidoMailActual(mail);
         conversacionService.crearConversacion(owner, guest, contenidoMailActual, significado);
         respuestaService.obtenerMensajeCoordinacionAGuest(guest, horario, function(respuesta){
            ioService.enviarMail(owner.botEmail, guest.email, owner.email, mail.subject, mail.messageId, respuesta, mail.text, callback, error);
            var mensajeDeGaia = conversacionService.armarMensajeProponerHorario(respuesta, horario);
            conversacionService.agregarMensajeAConversacion(owner.email, guest.email, mensajeDeGaia)
         });
      } else {
         let respuesta = "Lo siento, no hay horarios disponibles para agendar la reunión.";
         ioService.enviarMail(owner.botEmail, guest.email, owner.email, mail.subject, mail.messageId, respuesta, mail.text, callback, error);
      }
   }, function(error){
      log.error(error);
      ioService.enviarMail(owner.botEmail, guest.email, owner.email, mail.subject, mail.messageId, respuestaDeError, mail.text, callback, error);
   });
}


module.exports.aceptarReunion = function(owner, guest, mail, significado, callback, error){
   conversacionService.agregarMensajeAConversacion(owner.email, guest.email, mail.text, function(conversacion){
      var mensajeDePropuesta = conversacionService.obtenerUltimoMensajeConSignificado(conversacion, "proponer_horario");
      log.info('Mensaje de propuesta de horario: ', mensajeDePropuesta);
      if(mensajeDePropuesta){
         var iniciohuecoAceptado = mensajeDePropuesta.significado.intervalos[0].desde;
         calendarioService.agregarEvento(owner.id, iniciohuecoAceptado, guest.name || guest.email);
         respuestaService.obtenerMensajeConfirmacionReunion(owner, iniciohuecoAceptado, function(respuesta){
            ioService.enviarMail(owner.botEmail, guest.email, owner.email, mail.subject, mail.messageId, respuesta, mail.text, callback, error);
            var mensajeDeGaia = conversacionService.armarMensajeConfirmarReunion(respuesta, iniciohuecoAceptado);
            conversacionService.agregarMensajeAConversacion(owner.email, guest.email, mensajeDeGaia);
         });
      } else {
         var respuesta = "Disculpe, no sé a qué reunión se refiere."
         ioService.enviarMail(owner.botEmail, guest.email, owner.email, mail.subject, mail.messageId, respuesta, mail.text, callback, error);
      }
   }, function() {
      log.error('No pude agregar el mensaje a la conversacion del owner ' + owner.email + ' y guest ' + guest.email);
      error();
   });
}
