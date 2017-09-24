const calendar_helper = require('../google/calendar_helper.js');
const request = require('request');

function buscarhueco(auth, fecha_desde, fecha_hasta){
  //console.log(auth)
  calendar_helper.listar_eventos(auth, fecha_desde, fecha_hasta, function(eventos){

    // la logica del for
    if(eventos =! null){
      for (var i = 0; i < eventos.length; i++) {
        var event = eventos[i];
        var start = event.start.dateTime || event.start.date;
        var end = event.end.dateTime || event.start.date
        console.log('%s - %s', start,'%s - %s', end, '%s - %s', event.summary);
      }

    }

  })
}


module.exports = function(app) {

  app.post('/process', (req, res) => {
	console.log("--> process " + req.body.msj);

    ia_adapter.process(req.body.msj, function(err, respuesta) {
        if (err) res.status(500).json("Hubo un error :( ");
        res.status(200).json(respuesta);
    });
  });

  // Dado un usuario obtiene el proximo "hueco" disponible en su calendario
  // Input: -- Id usuario
  //        -- Fecha hora desde (2011-06-03T10:00:00-07:00) verificar
  //        -- Fecha hora hasta
  app.get('/proximodisponible', (req, res) => {

    //console.log("--> proximodisponible " + req);

    usuario = req.query.usuario
    fecha_desde = req.query.desde
    fecha_hasta = req.query.hasta

    // Levantar las credenciales para ese usuario
    calendar_helper.load_credential(usuario, function(auth){
      buscarhueco(auth, fecha_desde, fecha_hasta)
    })

    // Buscar en el calendario los eventos entre fecha desde y fecha hasta

    // Buscar hueco, un loop que cuando encuentra uno corta.
    // Arranca desde fecha hora desde y termina en fecha hora hasta.

     // Armar respuesta

     respuesta = {haydisponible: true, fecha_desde: "", fecha_hasta: ""}

     res.status(200).json(respuesta);
  });

  app.get('/dummy', (req, res) => {

    console.log("--> dummy " + req.body);

    respuesta = "vos me mandaste: " + req.body;

	   res.status(200).json(respuesta);
  });

};
