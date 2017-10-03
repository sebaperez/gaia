var urlBaseProd = "http://" + process.env.IP;

var prod = process.env.ENTORNO == 'prod'

module.exports.config = {
   userApiUrls: {
      clientes: prod ? urlBaseProd + ":3000/api/Clients": "http://localhost:5555/test/user/api/Clientes"
   },
   iaApiUrls: {
      procesar: prod ? urlBaseProd + ":3001/process" : "http://localhost:5555/test/ia/process"
   },
   conversacionApiUrls: {
      conversaciones: prod ? urlBaseProd + ":9001/conversacion" : "http://localhost:5555/test/conversacion"
   },
   respuestaApiUrls: {
      solicitarReunionAlGuest: prod ? urlBaseProd + ":9000/respuesta/solicitarReunionAlGuest/parser" : "http://localhost:5555/test/respuesta/solicitarReunionAlGuest/parser"
   },
   calendarioApiUrls: {
      huecos: "http://localhost:5555/test/calendario/huecos"
   },
   ioApiUrls: {
      enviar: prod ? urlBaseProd + ":4444/send" : "http://localhost:5555/test/io/send"
   }
};
