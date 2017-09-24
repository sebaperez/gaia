var request = require('request');
var config = require('../config/config').config;

function enviarMail(mail, res, callback) {

   var enviarMailUrl = config.ioApiUrls.enviar;

   request.post({
      url: enviarMailUrl,
      json: true,
      body: mail
   }, function (error, response, body) {
      if (error || response.statusCode != 200) {
         console.error('Fallo en el envio de la respuesta por mail. ', error);
         res.status(500).send();
      } else{
         res.status(200).send();
      }
   });

}

module.exports.enviarMail = enviarMail;
