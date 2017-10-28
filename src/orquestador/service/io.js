var request = require('request');
var config = require('../config/config').config;
var log = require('log4js').getLogger();
log.level = 'debug';

module.exports.enviarMail = function (mailRemitente, mailDestinatario, mailCC, asuntoMail, idMensaje, respuesta, contenidoMail, callback, err) {

   var enviarMailUrl = config.ioApiUrls.enviar;

   var separador = '\n\n\n---------- Forwarded message ----------\n\n';

   var mail = {
      from: mailRemitente,
      to: mailDestinatario,
      cc: mailCC,
      subject: 'Re: ' + asuntoMail,
      inReplyTo: idMensaje,
      text: respuesta + separador + contenidoMail
   }

   request.post({
      url: enviarMailUrl,
      json: true,
      body: mail
   }, function (error, response, body) {
      if (error || response.statusCode != 200) {
         log.error('Fallo en el envio de mail.', error);
         err();
      } else{
         log.info("Mail enviado: ", mail);
         callback();
      }
   });

}
