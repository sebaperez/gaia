module.exports.config = {
   userApiUrls: {
      clientes: "http://localhost:5555/test/user/api/Clientes"
   },
   iaApiUrls: {
      procesar: "http://localhost:5555/test/ia/process"
   },
   conversacionApiUrls: {
      conversaciones: "http://localhost:5555/test/conversacion"
   },
   respuestaApiUrls: {
      solicitarReunionAlGuest: "http://localhost:5555/test/respuesta/solicitarReunionAlGuest/parser"
   },
   calendarioApiUrls: {
      huecos: "http://localhost:5555/test/calendario/huecos"
   }
};
