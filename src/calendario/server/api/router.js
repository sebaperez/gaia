const calendar_helper = require('../google/calendar_helper.js');
const request = require('request');
const moment = require('moment');

function acotarFecha(intervalo,fechas){
  var inicio_Limite = intervalo.hora_inicio
  var fin_Limite = intervalo.hora_fin
  var cantidadFechas = fechas.length
  var retorno = []
  for (var i = 0; i < cantidadFechas;i++){
    var moment_desde = moment(fechas[i].desde)
    var moment_hasta = moment(fechas[i].hasta)
    var desde = moment_desde.get('hour')
    var hasta = moment_hasta.get('hour')
    if(inicio_Limite > desde){
      moment_desde.set('hour',inicio_Limite)
    }
    if(fin_Limite < hasta){
      moment_hasta.set('hour',fin_Limite)
    }
    retorno.push({desde: moment_desde.toISOString(),hasta:moment_hasta.toISOString()})
  }
  return retorno
}


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

    calendar_helper.load_credential(usuario, function(auth, intervalo){
    //coleccion de fechas
    fechas = req.body
    cantidadFechas = fechas.length
    console.log(cantidadFechas)
    console.log("fecha original: "+JSON.stringify(fechas));
    var FechaAcotada = acotarFecha(intervalo,fechas)
    console.log("fecha acotada: "+JSON.stringify(FechaAcotada))
    fechas = FechaAcotada
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
              i++
              console.log("cantidad fechas: "+cantidadFechas)
              if (cantidadFechas > i)
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
  });

  // Dado una fecha se la agrega al calendario
  // Input: -- Id usuario
  //        -- Fecha hora desde (2011-06-03T10:00:00-07:00) verificar
  //        -- Fecha hora hasta
  app.post('/agregarEvento', (req, res) => {
    var respuesta = null
    //ID de usuario
    usuario = req.query.usuario
    description = req.body.description
    desde = req.body.fecha_desde
    hasta = req.body.fecha_hasta

    calendar_helper.load_credential(usuario, function(auth, intervalo){

      calendar_helper.agregar_evento(auth,description,desde,hasta,function(e){
        if(e){
          res.status(200).json(e)
        }
        else{
          res.status(400).json(e)
        }
      })

    })


})
}
