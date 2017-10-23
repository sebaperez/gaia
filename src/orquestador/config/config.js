var prod = true;
var urlBase;
if(prod){
   urlBase = 'http://45.55.187.250'
} else {
   urlBase = 'http://localhost:5555/test'
}

module.exports.config = {
   userApiUrls: {
      clientes: prod ? urlBase + ":3000/api/Clients": urlBase + "/user/api/Clientes"
   },
   iaApiUrls: {
      procesar: prod ? urlBase + ":3003/process" : urlBase + "/ia/process"
   },
   conversacionApiUrls: {
      conversaciones: prod ? urlBase + ":9001/conversacion" : urlBase + "/conversacion"
   },
   respuestaApiUrls: {
      solicitarReunionAlGuest: prod ? urlBase + ":9000/respuesta/solicitarReunionAlGuest/parser" : urlBase + "/respuesta/solicitarReunionAlGuest/parser",
      confirmarReunion: prod ? urlBase + ":9000/respuesta/confirmarReunion/parser" : urlBase + "/respuesta/confirmarReunion/parser"
   },
   calendarioApiUrls: {
      huecos: prod ? urlBase + ":3009/proximodisponible" : urlBase + "/calendario/proximodisponible",
      agendar: prod ? urlBase + ":3009/agregarEvento" : urlBase + "/calendario/agregarEvento"
   },
   ioApiUrls: {
      enviar: prod ? "http://104.131.40.146:4444/send" : urlBase + "/io/send"
   }
};
