var prod = true;
var urlBase;
if(prod){
   urlBase = 'http://45.55.187.250'
} else {
   urlBase = 'http://localhost:5555/test'
}

module.exports.config = {
   userApiUrls: {
      clientes: urlBase + (prod ? ":3000/api/Clients" : "/user/api/Clientes")
   },
   iaApiUrls: {
      procesar: urlBase + (prod ? ":3003/process" : "/ia/process")
   },
   conversacionApiUrls: {
      conversaciones: urlBase + (prod ? ":9001/conversacion" : "/conversacion")
   },
   respuestaApiUrls: {
      solicitarReunionAlGuest: urlBase + (prod ? ":9000/respuesta/solicitarReunionAlGuest/parser" : "/respuesta/solicitarReunionAlGuest/parser"),
      confirmarReunion: urlBase + (prod ? ":9000/respuesta/confirmarReunion/parser" : "/respuesta/confirmarReunion/parser"),
      error: urlBase + (prod ? ":9000/respuesta/confirmarReunion/parser" : "/respuesta/confirmarReunion/parser")
   },
   calendarioApiUrls: {
      huecos: urlBase + (prod ? ":3009/proximodisponible" : "/calendario/proximodisponible"),
      agendar: urlBase + (prod ? ":3009/agregarEvento" : "/calendario/agregarEvento"),
      eliminar: urlBase + (prod ? ":3009/quitarEvento" : "/calendario/quitarEvento")
   },
   ioApiUrls: {
      enviar: prod ? "http://104.131.40.146:4444/send" : (urlBase + "/io/send")
   }
};
