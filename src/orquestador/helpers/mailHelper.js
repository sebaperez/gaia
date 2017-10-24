module.exports.obtenerIntencion = function(significado) {
   if(significado && significado.intents) {
      return significado.intents[0];
   } else {
      return "desconocida"
   }
}

module.exports.obtenerGuestMail = function(mails, owner){
   if(mails.length > 3){
      log.error("No está soportado recibir más de un guest");
   }
   for (var i = 0; i < mails.length; i++) {
      if(mails[i] != owner.email && mails[i] != owner.botEmail){
         return mails[i];
      }
   }
}

module.exports.obtenerGuestNombre = function(mail, guestMail){
   if(guestMail == mail.from.value[0].address){
      return mail.from.value[0].name
   } else if (guestMail == mail.to.value[0].address) {
      return mail.to.value[0].name
   } else if (mail.cc && guestMail == mail.cc.value[0].address) {
      return mail.cc.value[0].name
   }
}
