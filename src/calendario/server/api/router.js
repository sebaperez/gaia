const calendar_helper = require('../google/calendar_helper.js');
const request = require('request');

function buscarhueco(auth, fecha_desde, fecha_hasta){
  calendar_helper.listar_eventos(auth, fecha_desde, fecha_hasta, function(eventos){

    // parsear desde y hasta y asignar a variable
    //sacar horas de diferencia entre desde y hasta -> horas
    /* for var i = 0 ; i < horas ; i++) {
      hasta = desde + ( i + 1)
      calendar_helper.listar_eventos(auth,desde,hasta, function (eventos))
      {
        if (eventos =! null)
        {
          if (eventos.lenght = 0)
          {
            encontre un hueco
            cortar! return! salir! explotar todo!
          }
        }
        if (err) {
          console.log('error: ' + err);
          callback(null);
          return;
        }
      }
    }*/
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

    //ID de usuario
    usuario = req.query.usuario
    //req de preferencias de usuario (token y horario)
    calendar_helper.load_credential(usuario, function(auth){
    //coleccion de fechas
    fechas = req.query.fechas
    if (fechas =! null){
      for (var i= 0 ; i < fechas.lenght; i++) {
        var intervaloFecha = fechas[i]
        var desde = intervaloFecha.desde;
        var hasta = intervaloFecha.hasta;

        if (true) //dentro de preferencias)
        {
          buscarhueco(auth,desde,hasta)
        }
      }
    }
    }

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
