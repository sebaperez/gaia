var mailHelper = require('../helpers/mailHelper')
var conversacionService = require('../service/conversacion');
var calendarioService = require('../service/calendario');
var respuestaService = require('../service/respuesta');
var ioService = require('../service/io');
var log = require('log4js').getLogger();
log.level = 'debug';

var respuestaDeError = "Lo siento, no estoy disponible en este momento."

module.exports.responderAMailVacio = function(owner, mail, reject, callback) {

   var respuestaMailVacio = 'Me llegó el mail vacío.'
   log.info(respuestaMailVacio);
   ioService.responderMail(owner.botEmail, mail.from.value[0].address, null, respuestaMailVacio, mail, reject, callback);
}

function responderTexto (owner, mail, texto, reject, callback) {

   ioService.responderMail(owner.botEmail, mail.from.value[0].address, null, texto, mail, reject, callback);
};
module.exports.responderTexto = responderTexto


module.exports.proponerHorarioReunion = function(owner, guest, mail, significado){

   calendarioService.obtenerHueco(significado.fechas, significado.intervalos, owner.id, errorResponse, function(horario) {
      if(horario){
         var contenidoMailActual = mailHelper.obtenerContenidoMailActual(mail);
         conversacionService.crearConversacion(owner, guest, contenidoMailActual, significado, errorResponse, function(nuevaConversacion){
            respuestaService.obtenerMensajeCoordinacionAGuest(guest, horario, errorResponse, function(respuesta) {
               var mensajeDeGaia = conversacionService.armarMensajeProponerHorario(respuesta, horario);
               conversacionService.agregarMensajeAConversacion(mensajeDeGaia, nuevaConversacion)
               conversacionService.actualizarConversacion(nuevaConversacion)
               ioService.responderMail(owner.botEmail, guest.email, owner.email, respuesta, mail);
            });
         });
      } else {
         let respuesta = "Lo siento, no hay horarios disponibles para agendar la reunión.";
         ioService.responderMail(owner.botEmail, guest.email, owner.email, respuesta, mail);
      }
   });
}


module.exports.proponerNuevoHorarioReunion = function(owner, guest, mail, significado, conversacion){
   log.error('Negociar reunión todavía no implementado.');
   errorResponse()
};


module.exports.cancelarReunionAgendada = function(owner, guest, mail, significado, conversacion){

   conversacionService.agregarMensajeAConversacion(mailHelper.obtenerContenidoMailActual(mail), conversacion);
   var mensajeDePropuesta = conversacionService.obtenerUltimoMensajeConSignificado(conversacion, "confirmar_reunion");
   if(mensajeDePropuesta){
      calendarioService.eliminarEvento(owner.id, mensajeDePropuesta.evento.id, errorResponse, function(){
         respuestaService.obtenerRespuestaCancelacionReunion(mensajeDePropuesta.evento, errorResponse, function(respuesta){
            var mensajeDeGaia = conversacionService.armarMensajeCancelacionReunion(respuesta, mensajeDePropuesta.evento);
            conversacionService.agregarMensajeAConversacion(mensajeDeGaia, conversacion);
            conversacionService.actualizarConversacion(conversacion)
            ioService.responderMail(owner.botEmail, guest.email, owner.email, respuesta, mail);
         });
      });
   } else {
      ioService.responderTexto(owner, mail, "Disculpe, no sé a qué reunión se refiere.");
   }
};


module.exports.confirmarReunion = function(owner, guest, mail, significado, conversacion){

   conversacionService.agregarMensajeAConversacion(mailHelper.obtenerContenidoMailActual(mail), conversacion);
   var mensajeDePropuesta = conversacionService.obtenerUltimoMensajeConSignificado(conversacion, "proponer_horario");
   if(mensajeDePropuesta){
      var iniciohuecoAceptado = mensajeDePropuesta.significado.intervalos[0].desde;
      calendarioService.agregarEvento(owner.id, iniciohuecoAceptado, guest.name || guest.email, errorResponse, function(evento){
         respuestaService.obtenerMensajeConfirmacionReunion(owner, evento.start.dateTime, errorResponse, function(respuesta){
            var mensajeDeGaia = conversacionService.armarMensajeConfirmarReunion(respuesta, evento);
            conversacionService.agregarMensajeAConversacion(mensajeDeGaia, conversacion);
            conversacion.abierto = false;
            conversacionService.actualizarConversacion(conversacion)
            ioService.responderMail(owner.botEmail, guest.email, owner.email, respuesta, mail);
         });

      });
   } else {
      ioService.responderTexto(owner, mail, "Disculpe, no sé a qué reunión se refiere.");
   }
}


function errorResponse(error){
   log.error("Hubo un error en el módulo orquestador.", error)
   // responderTexto(owner, mail, "Lo siento, no estoy disponible en este momento. Contáctese directamente con " + owner.email)
}
