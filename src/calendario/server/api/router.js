var usuariosHelper = require('../usuarios/usuarios_helper')
const calendar_helper = require('../google/calendar_helper.js');
const request = require('request');
const moment = require('moment');
var log = require('log4js').getLogger();
log.level = 'debug';

function acotarFechas(horaInicioLimite, horaFinLimite, fechas){
  var cantidadFechas = fechas.length
  var retorno = []
  for (var i = 0; i < cantidadFechas; i++){
    var moment_desde = moment(fechas[i].desde)
    var moment_hasta = moment(fechas[i].hasta)
    var horaDesde = moment_desde.get('hour')
    var horaHasta = moment_hasta.get('hour')
    if(horaInicioLimite > horaDesde){
      moment_desde.set('hour', horaInicioLimite)
    }
    if(horaFinLimite < horaHasta){
      moment_hasta.set('hour', horaFinLimite)
    }
    retorno.push({
      desde: moment_desde.format('YYYY-MM-DDTHH:mm:ssZ'),
      hasta: moment_hasta.format('YYYY-MM-DDTHH:mm:ssZ')
    })
  }
  return retorno
}


function buscarhueco(auth, fecha_desde, fecha_hasta, callback){
    // parsear desde y hasta y asignar a variable
    //sacar horas de diferencia entre desde y hasta -> horas
    var desde = moment(fecha_desde)
    var hasta = moment(fecha_hasta)
    var newHasta = moment(fecha_desde).add(1, 'hours')

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
                 var diferenciaHoras = hasta.diff(desde, 'hours')
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
                   calendar_helper.listar_eventos(auth, desde, newHasta, function(e) { logicaEvento(e) })
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
    log.info("Consulta a /proximodisponible")
    log.debug("Body:",req.body)
    var usuarioId = req.query.usuario
    if(!usuarioId){
      res.status(400).send("Falta el parametro usuario");
      return
    }
    usuariosHelper.obtenerUsuario(usuarioId, function(usuario){

      calendar_helper.load_credential(usuario, function(auth) {
         //coleccion de fechas
         var fechas = req.body
         if(JSON.stringify(fechas) === "{}"){
            res.status(400).send("Faltan las fechas en el body");
            return
         }
         var cantidadFechas = fechas.length
         var fechasAcotadas = acotarFechas(usuario.timeStart, usuario.timeEnd, fechas)
         if (fechasAcotadas != null) {
            //for (var i= 0 ; i < fechas.length; i++) {
            var i = 0
            var intervaloFecha = fechasAcotadas[i]
            var desde = intervaloFecha.desde;
            var hasta = intervaloFecha.hasta;

            buscarhueco(auth, desde, hasta, function(hueco) {
               var logicaBuscarHueco =  function(hueco) {
                  if (hueco) {
                     res.status(200).json(hueco);
                  } else {
                     i++
                     if (cantidadFechas > i) {
                        var intervaloFecha = fechasAcotadas[i]
                        var nuevoDesde = intervaloFecha.desde;
                        var nuevoHasta = intervaloFecha.hasta;
                        buscarhueco(auth, nuevoDesde, nuevoHasta, function(proxHueco) { logicaBuscarHueco(proxHueco) } )
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

    })

  });

  // Dado una fecha se la agrega al calendario
  // Input: -- Id usuario
  //        -- Fecha hora desde (2011-06-03T10:00:00-07:00) verificar
  //        -- Fecha hora hasta
  app.post('/agregarEvento', (req, res) => {
     log.info("Consulta a /agregarEvento")
     log.debug("Body:",req.body)

    var usuarioId = req.query.usuario
    if(!usuarioId){
      res.status(400).send("Falta el parametro usuario");
      return
    }
    if(JSON.stringify(req.body) === "{}"){
      res.status(400).send("Falta el body");
      return
    }
    var description = req.body.description
    var desde = req.body.fecha_desde
    var hasta = req.body.fecha_hasta

    calendar_helper.load_credential(usuarioId, function(auth) {

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
