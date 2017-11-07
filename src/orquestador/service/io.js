var request = require('request');
var config = require('../config/config').config;
var moment = require('moment');
moment.locale('es')
process.env.TZ = 'America/Buenos_Aires'
var log = require('log4js').getLogger();
log.level = 'debug';

module.exports.responderMail = function (mailRemitente, mailDestinatario, mailCC, mensaje, mail, reject, callback) {

   var enviarMailUrl = config.ioApiUrls.enviar;

   var headerNuevoMensaje = '<div dir="ltr">' + mensaje + '<div><br></div><div><br>'
   var headerMailRespondido = '<div>' +
   '---------- Mensaje enviado ----------<br>' +
   'De: <b>'+ mail.from.value[0].name +'</b> &lt;<a href="mailto:'+ mail.from.value[0].address +'" target="_blank" rel="noopener noreferrer">'+ mail.from.value[0].address +'</a>&gt;<br>' +
   'Fecha: ' + moment().format("d [de] MMMM [de] YYYY, HH:mm") + '<br>' +
   'Asunto: Re: ' + mail.subject + '<br>' +
   'Para: '+ mail.to.value[0].name +' &lt;<a href="mailto:'+ mail.to.value[0].address +'" target="_blank" rel="noopener noreferrer">'+ mail.to.value[0].address +'</a>&gt;<br>' +
   '<br><br>'
   var footerMailRespondido = '</div></div>'
   var footerNuevoMensaje = '</div>'

   var nuevoMail = {
      from: mailRemitente,
      to: mailDestinatario,
      cc: mailCC,
      subject: mail.subject.indexOf('Re:') == 0? 'Re: ' + mail.subject : mail.subject,
      inReplyTo: mail.messageId,
      html: headerNuevoMensaje + headerMailRespondido + mail.html + footerMailRespondido + footerNuevoMensaje,
      text: mensaje
   }

   request.post({
      url: enviarMailUrl,
      json: true,
      body: nuevoMail
   }, function (error, response, body) {
      if (reject && (error || response.statusCode != 200)) {
         log.error('Fallo en el envio de mail.', error);
         reject(error || response.statusMessage)
      } else {
         log.info("Mail enviado: ", nuevoMail);
         if(callback){
            callback()
         }
      }
   });

}
