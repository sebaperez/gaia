module.exports.obtenerIntencion = function(significado) {
   if(significado && significado.intents) {
      return significado.intents[0];
   } else {
      return "desconocida"
   }
}

module.exports.obtenerGuestMail = function(mail, owner){
   if(mail.cc.value[0]){
      var mailCC = mail.cc.value[0].address;
   }
   var mails = [mail.from.value[0].address, mail.to.value[0].address, mailCC]

   if(mail.from.value.length > 1 || mail.to.value > 1){
      log.error("No está soportado recibir más de un guest");
   }
   for (var i = 0; i < mails.length; i++) {
      if(mails[i] != owner.email && mails[i] != owner.botEmail){
         return mails[i];
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
   return mail.text.split("----------", 1)[0].trim();
}
