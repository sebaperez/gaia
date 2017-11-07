var mailHelper = require('../helpers/mailHelper')
var conversacionService = require('../service/conversacion');
var calendarioService = require('../service/calendario');
var respuestaService = require('../service/respuesta');
var ioService = require('../service/io');
var log = require('log4js').getLogger();
log.level = 'debug';
var moment = require('moment');
moment.locale('es')
process.env.TZ = 'America/Buenos_Aires'


module.exports.responderAMailVacio = function(owner, mail, reject, callback) {

   var respuestaMailVacio = 'Me llegó el mail vacío.'
   log.info(respuestaMailVacio);
   ioService.responderMail(owner.botEmail, mail.from.value[0].address, null, respuestaMailVacio, mail, reject, callback);
}


function responderTexto(owner, mail, texto, reject, callback) {
   ioService.responderMail(owner.botEmail, mail.from.value[0].address, null, texto, mail, reject, callback);
};
module.exports.responderTexto = responderTexto


module.exports.proponerNuevaReunion = function(owner, guest, mail, significado){

   var intervalos = calendarioService.unificarIntervalosYFechas(significado.intervalos, significado.fechas)
   var contenidoMailActual = mailHelper.extraerContenidoMailActual(mail);
   conversacionService.crearConversacion(owner, guest, contenidoMailActual, significado, errorResponse, function(nuevaConversacion){
      proponerHorarioYActualizarConversacion(intervalos, null, owner, guest, mail, nuevaConversacion, errorResponse)
   });
   function errorResponse(error){
      log.error("Hubo un error en el módulo orquestador.", error)
      responderTexto(owner, mail, "Lo siento, no estoy disponible en este momento. Contáctese directamente con " + owner.email)
   }
}

module.exports.proponerNuevoHorarioReunion = function(owner, guest, mail, significado, conversacion){

   var intervalos = calendarioService.unificarIntervalosYFechas(significado.intervalos, significado.fechas)
   var intervalosRechazados = conversacionService.obtenerIntervalosDeIntencion(conversacion, "proponer_horario");
   var contenidoMailActual = mailHelper.extraerContenidoMailActual(mail);
   conversacionService.agregarMensajeAConversacion(contenidoMailActual, conversacion);
   proponerHorarioYActualizarConversacion(intervalos, intervalosRechazados, owner, guest, mail, conversacion, errorResponse);
   function errorResponse(error){
      log.error("Hubo un error en el módulo orquestador.", error)
      responderTexto(owner, mail, "Lo siento, no estoy disponible en este momento. Contáctese directamente con " + owner.email)
   }
};

function proponerHorarioYActualizarConversacion(intervalos, intervalosRechazados, owner, guest, mail, conversacion, errorResponse){
   calendarioService.obtenerHueco(intervalos, intervalosRechazados, owner.id, errorResponse, function(horario) {
      if(horario){
         var horarioHasta =
         respuestaService.obtenerMensajeCoordinacionAGuest(guest, horario, errorResponse, function(respuesta) {
            var mensajeDeGaia = conversacionService.armarMensajeProponerHorario(respuesta, horario, horarioHasta);
            conversacionService.agregarMensajeAConversacion(mensajeDeGaia, conversacion)
            conversacionService.actualizarConversacion(conversacion)
            ioService.responderMail(owner.botEmail, guest.email, null, respuesta, mail);
         });
      } else {
         let respuesta = "Lo siento, no hay horarios disponibles para agendar la reunión.";
         ioService.responderMail(owner.botEmail, guest.email, null, respuesta, mail);
      }
   })
}


module.exports.rechazarHorarioReunion = function(owner, guest, mail, significado, conversacion){

   conversacionService.agregarMensajeAConversacion(mailHelper.extraerContenidoMailActual(mail), conversacion);
   respuestaService.obtenerRespuestaPreguntarHorarios(function(respuesta){
      var mensajeDeGaia = conversacionService.armarMensajePreguntarHorarios(respuesta);
      conversacionService.agregarMensajeAConversacion(mensajeDeGaia, conversacion);
      conversacionService.actualizarConversacion(conversacion)
      ioService.responderMail(owner.botEmail, mail.from.value[0].address, null, respuesta, mail);
   });
};


module.exports.cancelarReunionAgendada = function(owner, guest, mail, significado, conversacion){

   conversacionService.agregarMensajeAConversacion(mailHelper.extraerContenidoMailActual(mail), conversacion);
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
      responderTexto(owner, mail, "Disculpe, no sé a qué reunión se refiere.");
   }
   function errorResponse(error){
      log.error("Hubo un error en el módulo orquestador.", error)
      responderTexto(owner, mail, "Lo siento, no estoy disponible en este momento. Contáctese directamente con " + owner.email)
   }
};


module.exports.confirmarReunion = function(owner, guest, mail, significado, conversacion){

   conversacionService.agregarMensajeAConversacion(mailHelper.extraerContenidoMailActual(mail), conversacion);
   var mensajeDePropuesta = conversacionService.obtenerUltimoMensajeConSignificado(conversacion, "proponer_horario");
   if(mensajeDePropuesta){
      var iniciohuecoAceptado = mensajeDePropuesta.significado.intervalos[0].desde;
      calendarioService.agregarEvento(owner, guest, mail.subject, iniciohuecoAceptado, errorResponse, function(evento){
         respuestaService.obtenerMensajeConfirmacionReunion(owner, evento.start.dateTime, errorResponse, function(respuesta){
            var mensajeDeGaia = conversacionService.armarMensajeConfirmarReunion(respuesta, evento);
            conversacionService.agregarMensajeAConversacion(mensajeDeGaia, conversacion);
            conversacion.abierto = false;
            conversacionService.actualizarConversacion(conversacion)
            ioService.responderMail(owner.botEmail, guest.email, owner.email, respuesta, mail);
         });

      });
   } else {
      responderTexto(owner, mail, "Disculpe, no sé a qué reunión se refiere.");
   }
   function errorResponse(error){
      log.error("Hubo un error en el módulo orquestador.", error)
      responderTexto(owner, mail, "Lo siento, no estoy disponible en este momento. Contáctese directamente con " + owner.email)
   }
}
