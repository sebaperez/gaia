var request = require('request');
var config = require('../config/config').config;
var log = require('log4js').getLogger();
log.level = 'debug';

module.exports.responderMail = function (mailRemitente, mailDestinatario, mailCC, mensaje, mail, reject, callback) {

   var enviarMailUrl = config.ioApiUrls.enviar;

   var separador = '\n\n\n---------- Forwarded message ----------\n\n';

   var nuevoMail = {
      from: mailRemitente,
      to: mailDestinatario,
      cc: mailCC,
      subject: 'Re: ' + mail.subject,
      inReplyTo: mail.messageId,
      text: mensaje + separador + mail.text
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
