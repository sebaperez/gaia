var request = require('request');
var config = require('../config/config').config;

function enviarMail(mailBot, mailDestinatario, mailRemitente, asuntoMail, idMensaje, respuesta, contenidoMail, callback, err) {

   var enviarMailUrl = config.ioApiUrls.enviar;


   var mail = {
      // from: mailBot,
      from: 'esteban@gaiameet.com',
      to: mailDestinatario,
      cc: mailRemitente,
      subject: 'Re: ' + asuntoMail,
      inReplyTo: idMensaje,
      text: respuesta + "\n\n" + contenidoMail
   }

   request.post({
      url: enviarMailUrl,
      json: true,
      body: mail
   }, function (error, response, body) {
      if (error || response.statusCode != 200) {
         console.error('Fallo en el envio de la respuesta por mail. ', error);
         err();
      } else{
         console.log("Mail enviado: " + JSON.stringify(mail));
         callback();
      }
   });

}

module.exports.enviarMail = enviarMail;
