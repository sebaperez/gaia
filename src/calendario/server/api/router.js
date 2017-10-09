const calendar_helper = require('../google/calendar_helper.js');
const request = require('request');
const moment = require('moment');

function buscarhueco(auth, fecha_desde, fecha_hasta, callback){
    // parsear desde y hasta y asignar a variable
    //sacar horas de diferencia entre desde y hasta -> horas
    var desde = moment(fecha_desde)
    var hasta = moment(fecha_hasta)
    Newhasta = moment(fecha_desde)
    Newhasta = Newhasta.add(1,'hours')
    var retorno
    //console.log(hasta.toISOString())
    //console.log(Newhasta.toISOString())

      calendar_helper.listar_eventos(auth,desde,Newhasta, function (eventos)
      {
        var logicaEvento = function(eventos)
        {

        console.log("-------------------------------")
        if (eventos != null)
        {
          var cantidadEventos = eventos.length;
          console.log(eventos)
          console.log("cantidad eventos: " + cantidadEventos)
          console.log("desde: "+desde.toISOString())
          console.log("newhasta: "+Newhasta.toISOString())
          console.log("hasta: "+hasta.toISOString())
          var diferenciaHoras = hasta.diff(desde,'hours')
          console.log("diferenciaHoras: "+diferenciaHoras)
          if (cantidadEventos == 0)
           {

            console.log("HAY HUECO - Desde: " + desde.toISOString() )
            retorno = desde.toISOString()
            callback(retorno)
           }
          else
            {
              if(diferenciaHoras<=1){
                console.log("NO HAY HUECO")
                callback(null)
              }
              else{
            console.log("HAY EVENTO - " + eventos[0].summary);
             Newhasta = Newhasta.add( 1, 'hours')
             desde = desde.add(1,'hours')
             calendar_helper.listar_eventos(auth,desde,Newhasta,function(e) { logicaEvento(e) })
                }
            }
        }
        }
        logicaEvento(eventos)
      })
  //  }
}

module.exports = function(app) {
  // Dado un usuario obtiene el proximo "hueco" disponible en su calendario
  // Input: -- Id usuario
  //        -- Fecha hora desde (2011-06-03T10:00:00-07:00) verificar
  //        -- Fecha hora hasta
  app.post('/proximodisponible', (req, res) => {
    var respuesta = null
    //ID de usuario
    usuario = req.query.usuario
    //req de preferencias de usuario (token y horario)
    calendar_helper.load_credential(usuario, function(auth){
    //coleccion de fechas
    fechas = req.body
    console.log(fechas);
    if (fechas != null){
      //for (var i= 0 ; i < fechas.length; i++) {
        var i = 0
        var intervaloFecha = fechas[i]
        var desde = intervaloFecha.desde;
        var hasta = intervaloFecha.hasta;
        // TODO: Acotar intervalo segun preferencias del user

        buscarhueco(auth,desde,hasta,function(hueco)
        {
          var logicaBuscarHueco =  function(hueco){
            if (hueco)
              res.status(200).json(hueco);
            else {
              var i = i + 1

              if (fechas.lenght > i)
              {

              var intervaloFecha = fechas[i]
              var desde = intervaloFecha.desde;
              var hasta = intervaloFecha.hasta;

              buscarhueco(auth,desde,hasta, function(e) { logicaBuscarHueco(e) } )

              }
              else {
                  res.status(200).json(null);
              }
            }
          }

            logicaBuscarHueco(hueco)
        })

      //}
    }
  })
     //respuesta = {haydisponible: true, fecha_desde: "", fecha_hasta: ""}


  });
}
