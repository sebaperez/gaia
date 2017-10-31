var moment = require('moment');
var moment = require('moment-timezone');
moment.locale('es')
//process.env.TZ = 'America/Buenos_Aires'

module.exports = {
  parseText:function(respuesta, body, res) {
    var texto = respuesta.contenido
    /*
    JSON.parse(body.parametros).map(function(parametro){
      Object.keys(parametro).map(function(atributo){
        var replace = new RegExp(atributo,"g");
        texto = texto.replace(replace, parametro[atributo]);
      })
      console.log(texto)
    })
    */
    //var owner = JSON.parse(body.owner)
    /*
    for(var atributo in body.owner) {
      console.log(atributo)
      var replace = new RegExp('@' + atributo,"g");
      texto = texto.replace(replace, body.owner.atributo);
    }
    Object.keys(body.owner).map(function(atributo){

    })
    */
    if(body.nombre){
      texto = texto.replace(/@name/g, body.nombre);
    } else {
      texto = texto.replace(/@name/g, 'Hola');
    }
    console.log("La fecha para agendar es: " + body.hueco)
    /*
    var date = new Date(Date.parse(body.hueco))
    var dias = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"]
    var meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
    var fechaInformal = 'el ' + dias[date.getDay()] + ' ' + date.getDate() + ' de ' + meses[date.getMonth()];
    var minutos = date.getMinutes() == 0? '' : ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    var horaInformal = ' a las ' + date.getHours() + minutos + ' hs';

    var fecha = body.hueco;

    texto = texto.replace(/@fechas/g, (hoyManiana(fecha)? "" : "el ") + moment(fecha).calendar());
    texto = texto.replace(/@fechas/g, fechaInformal + horaInformal);
    */
    texto = texto.replace(/@fechas/g, moment.tz(body.hueco, "America/Argentina/Buenos_Aires").format('LLL'));
    return texto
  }
}

function hoyManiana(fechaString) {
   return fechaString.indexOf("hoy") > -1 || fechaString.indexOf("mañana") > -1
}
