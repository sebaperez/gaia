module.exports.obtenerIntencion = function(significado) {
   if(significado && significado.intents) {
      return significado.intents[0];
   }
}


module.exports.extraerBotEmail = function(mail){
   var personas = [mail.from.value, mail.to.value]
   if(mail.cc && mail.cc.value && mail.cc.value.length > 0){
      personas.push(mail.cc.value);
   }
   for (var i = 0; i < personas.length; i++) {
      for (var j = 0; j < personas[i].length; j++) {
         if(personas[i][j].address.indexOf('@gaiameet.com') > -1)
            return personas[i][j].address
      }
   }
}


module.exports.extraerGuest = function(owner, mail){
   var personas = [mail.from.value, mail.to.value]
   if(mail.cc && mail.cc.value && mail.cc.value.length > 0){
      personas.push(mail.cc.value);
   }
   for (var i = 0; i < personas.length; i++) {
      for (var j = 0; j < personas[i].length; j++) {
         if(personas[i][j].address != owner.email && personas[i][j].address != owner.botEmail)
            return {
               name: personas[i][j].name,
               email: personas[i][j].address
            }
      }
   }
}

module.exports.extraerContenidoMailActual = function(mail){
   //TODO agregar soporte para outlook
   return mail.text.split("----------", 1)[0].split("_______________")[0].split("\n2017")[0].trim();
}
