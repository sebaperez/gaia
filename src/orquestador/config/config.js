var urlBaseProd = 'http://45.55.187.250'
var urlBaseTest = 'http://localhost:5555/test'
var prod = true;

module.exports.config = {
   userApiUrls: {
      clientes: prod ? urlBaseProd + ":3000/api/Clients": urlBaseTest + "/user/api/Clientes"
   },
   iaApiUrls: {
      procesar: prod ? urlBaseProd + ":3003/process" : urlBaseTest + "/ia/process"
   },
   conversacionApiUrls: {
      conversaciones: prod ? urlBaseProd + ":9001/conversacion" : urlBaseTest + "/conversacion"
   },
   respuestaApiUrls: {
      solicitarReunionAlGuest: prod ? urlBaseProd + ":9000/respuesta/solicitarReunionAlGuest/parser" : urlBaseTest + "/respuesta/solicitarReunionAlGuest/parser",
      confirmarReunion: prod ? urlBaseProd + ":9000/respuesta/confirmarReunion/parser" : urlBaseTest + "/respuesta/confirmarReunion/parser"
   },
   calendarioApiUrls: {
      huecos: prod ? urlBaseProd + ":3009/proximodisponible" : urlBaseTest + "/calendario/proximodisponible",
      agendar: prod ? urlBaseProd + ":3009/agregarEvento" : urlBaseTest + "/calendario/agregarEvento"
   },
   ioApiUrls: {
      enviar: prod ? "http://104.131.40.146:4444/send" : urlBaseTest + "/io/send"
   }
};
