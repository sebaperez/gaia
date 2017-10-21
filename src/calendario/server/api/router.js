const calendar_helper = require('../google/calendar_helper.js');
const request = require('request');
const moment = require('moment');
var log = require('log4js').getLogger();
log.level = 'debug';

function acotarFecha(intervalo, fechas){
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
    retorno.push({desde: moment_desde.format('YYYY-MM-DDTHH:mm:ssZ'),hasta:moment_hasta.format('YYYY-MM-DDTHH:mm:ssZ')})
  }
  return retorno
}


function buscarhueco(auth, fecha_desde, fecha_hasta, callback){
    // parsear desde y hasta y asignar a variable
    //sacar horas de diferencia entre desde y hasta -> horas
    var desde = moment(fecha_desde)
    var hasta = moment(fecha_hasta)
    var newHasta = moment(fecha_desde).add(1,'hours')
    var retorno
    //console.log(hasta.toISOString())
    //console.log(Newhasta.toISOString())

    calendar_helper.listar_eventos(auth, desde, newHasta, function (eventos)
    {
        var logicaEvento = function(eventos)
        {
           console.log("-------------------------------")
           if (eventos != null)
           {
             var cantidadEventos = eventos.length;
             //console.log(eventos)
             //console.log("cantidad eventos: " + cantidadEventos)
             //console.log("desde: "+desde.toISOString())
             //console.log("newhasta: "+Newhasta.toISOString())
             //console.log("hasta: "+hasta.toISOString())
             if (cantidadEventos == 0)
             {
               console.log("HAY HUECO - Desde: " + desde.format('YYYY-MM-DDTHH:mm:ssZ'))
               callback(desde.format('YYYY-MM-DDTHH:mm:ssZ'))
             }
             else
             {
                 var diferenciaHoras = hasta.diff(desde,'hours')
                 //console.log("diferenciaHoras: " + diferenciaHoras)
                 if(diferenciaHoras <= 1)
                 {
                   console.log("NO HAY HUECO")
                   callback(null)
                 }
                 else
                 {
                   console.log("HAY EVENTO - " + eventos[0].summary);
                   newHasta = newHasta.add( 1, 'hours')
                   desde = desde.add(1,'hours')
                   calendar_helper.listar_eventos(auth,desde,newHasta,function(e) { logicaEvento(e) })
                 }
             }
           }
        }
        logicaEvento(eventos)
    })

}

module.exports = function(app) {
  // Dado un usuario obtiene el proximo "hueco" disponible en su calendario
  // Input: -- Id usuario
  //        -- Fecha hora desde (2011-06-03T10:00:00-07:00) verificar
  //        -- Fecha hora hasta
  app.post('/proximodisponible', (req, res) => {
    //ID de usuario
    log.info("Consulta a /proximodisponible")
    var usuarioId = req.query.usuario
    if(!usuarioId){
      res.status(400).send("Falta el parametro usuario");
      return
    }

    calendar_helper.load_credential(usuarioId, function(auth) {
    //coleccion de fechas
    var fechas = req.body
    log.debug("Body:",req.body)
    if(JSON.stringify(fechas) === "{}"){
      res.status(400).send("Faltan las fechas en el body");
      return
    }
    var cantidadFechas = fechas.length
    var intervalo = {hora_inicio: 9, hora_fin: 18}
    var FechaAcotada = acotarFecha(intervalo, fechas)
    fechas = FechaAcotada
    if (fechas != null) {
      //for (var i= 0 ; i < fechas.length; i++) {
        var i = 0
        var intervaloFecha = fechas[i]
        var desde = intervaloFecha.desde;
        var hasta = intervaloFecha.hasta;
        // TODO: Acotar intervalo segun preferencias del user

        buscarhueco(auth, desde, hasta, function(hueco) {
          var logicaBuscarHueco =  function(hueco) {
            if (hueco) {
               res.status(200).json(hueco);
            } else {
              i++
              //console.log("cantidad fechas: "+cantidadFechas)
              if (cantidadFechas > i) {
                 var intervaloFecha = fechas[i]
                 var nuevoDesde = intervaloFecha.desde;
                 var nuevoHasta = intervaloFecha.hasta;

                 buscarhueco(auth, nuevoDesde, nuevoHasta, function(e) { logicaBuscarHueco(e) } )
              } else {
                 res.status(200).json(null);
              }
            }
          }
          logicaBuscarHueco(hueco)
        })

    }
   }, function(error){
      res.status(500).send(error);
   })
  });

  // Dado una fecha se la agrega al calendario
  // Input: -- Id usuario
  //        -- Fecha hora desde (2011-06-03T10:00:00-07:00) verificar
  //        -- Fecha hora hasta
  app.post('/agregarEvento', (req, res) => {
    //ID de usuario
    var usuario = req.query.usuario
    var description = req.body.description
    var desde = req.body.fecha_desde
    var hasta = req.body.fecha_hasta
    //console.log ("desde :"+desde)
    //console.log ("hasta :"+hasta)
    //console.log ("description :"+description)

    calendar_helper.load_credential(usuario, function(auth) {

      calendar_helper.agregar_evento(auth, description, desde, hasta, function(eventoCreado) {
          res.status(200).json(eventoCreado).send()
       }, function(err){
          res.status(500).send()
      })

    }, function(error){
      res.status(500).send(error)
    });

})
}
