module.exports.obtenerIntencion = function(significado) {
   if(significado && significado.intents) {
      return significado.intents[0];
   } else {
      return "desconocida"
   }
}


module.exports.obtenerBotMail = function(mail){
   var mails = [mail.from.value, mail.to.value]
   if(mail.cc.value.length > 0){
      mails.push(mail.cc.value);
   }
   for (var i = 0; i < mails.length; i++) {
      for (var j = 0; j < mails[i].length; j++) {
         if(mails[i][j].address.indexOf('gaiameet.com') > -1)
            return mails[i][j].address
      }
   }
}


module.exports.obtenerGuest = function(owner, mail){
   if(mail.from.value.length > 1 || mail.to.value > 1){
      log.error("No está soportado recibir más de un guest");
   }

   if(mail.from.value[0].address != owner.email && mail.from.value[0].address != owner.botEmail){
      return {
         name: mail.from.value[0].name,
         email: mail.from.value[0].address
      }
   } else if (mail.to.value[0].address != owner.email && mail.to.value[0].address != owner.botEmail) {
      return {
         name: mail.to.value[0].name,
         email: mail.to.value[0].address
      }
   } else if (mail.cc && mail.cc.value[0] && mail.cc.value[0].address != owner.email && mail.cc.value[0].address != owner.botEmail) {
      return {
         name: mail.cc.value[0].name,
         email: mail.cc.value[0].address
      }
   }
}

module.exports.obtenerContenidoMailActual = function(mail){
   //TODO agregar soporte para outlook
   return mail.text.split("----------", 1)[0].trim();
}
