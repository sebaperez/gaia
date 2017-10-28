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


module.exports.proponerHorarioReunion = function(owner, guest, mail, significado, callback, error){

   calendarioService.obtenerHueco(significado.fechas, significado.intervalos, owner.id, function(horario) {
      if(horario){
         var contenidoMailActual = mailHelper.obtenerContenidoMailActual(mail);
         conversacionService.crearConversacion(owner, guest, contenidoMailActual, significado, function(nuevaConversacion){
            respuestaService.obtenerMensajeCoordinacionAGuest(guest, horario, function(respuesta){
               ioService.enviarMail(owner.botEmail, guest.email, owner.email, mail.subject, mail.messageId, respuesta, mail.text, callback, error);
               var mensajeDeGaia = conversacionService.armarMensajeProponerHorario(respuesta, horario);
               conversacionService.agregarMensajeAConversacion(mensajeDeGaia, nuevaConversacion)
               conversacionService.actualizarConversacion(nuevaConversacion)
            });
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


module.exports.proponerNuevoHorarioReunion = function(owner, guest, mail, significado, conversacion, callback, error){
   log.error('Negociar reunión todavía no implementado.');
   error()
};


module.exports.cancelarReunionAgendada = function(owner, guest, mail, significado, conversacion, callback, error){

   var mensajeDePropuesta = conversacionService.obtenerUltimoMensajeConSignificado(conversacion, "confirmar_reunion");
   calendarioService.eliminarEvento(owner.id, mensajeDePropuesta.evento.id, function(){
      respuestaService.obtenerMensajeCancelacionReunion(mensajeDePropuesta.evento, function(respuesta){
         ioService.enviarMail(owner.botEmail, guest.email, owner.email, mail.subject, mail.messageId, respuesta, mail.text, callback, error);
         var mensajeDeGaia = conversacionService.armarMensajeCancelacionReunion(respuesta, mensajeDePropuesta.evento);
         conversacionService.agregarMensajeAConversacion(mensajeDeGaia, conversacion);
         conversacionService.actualizarConversacion(conversacion)
      });
   });
   //log.error('Cancelar reunión todavía no implementado.');
   error()
};


module.exports.confirmarReunion = function(owner, guest, mail, significado, conversacion, callback, error){

   conversacionService.agregarMensajeAConversacion(mail.text, conversacion, null, error);
   var mensajeDePropuesta = conversacionService.obtenerUltimoMensajeConSignificado(conversacion, "proponer_horario");
   if(mensajeDePropuesta){
      var iniciohuecoAceptado = mensajeDePropuesta.significado.intervalos[0].desde;
      calendarioService.agregarEvento(owner.id, iniciohuecoAceptado, guest.name || guest.email, function(evento){
         respuestaService.obtenerMensajeConfirmacionReunion(owner, evento.start.dateTime, function(respuesta){
            var mensajeDeGaia = conversacionService.armarMensajeConfirmarReunion(respuesta, evento);
            conversacionService.agregarMensajeAConversacion(mensajeDeGaia, conversacion);
            conversacion.abierto = false;
            conversacionService.actualizarConversacion(conversacion)
            ioService.enviarMail(owner.botEmail, guest.email, owner.email, mail.subject, mail.messageId, respuesta, mail.text, callback, error);
         });

      });
   } else {
      var respuesta = "Disculpe, no sé a qué reunión se refiere."
      ioService.enviarMail(owner.botEmail, guest.email, owner.email, mail.subject, mail.messageId, respuesta, mail.text, callback, error);
   }
}
