var moment = require('moment');
var moment = require('moment-timezone');
moment.locale('es')

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

    var calendarConfig = {sameElse: function () {
      return 'dddd DD [de] MMMM [a la' + ((this.hours() !== 1) ? 's' : '') + '] LT'}
    }
    var fechaFormateada = moment(body.hueco).tz("America/Argentina/Buenos_Aires").calendar(null, calendarConfig);
    texto = texto.replace(/@fechas/g, agregarEl(fechaFormateada)? 'el ' + fechaFormateada : fechaFormateada);
    return texto
  }
}

function agregarEl(fechaString) {
   return fechaString.indexOf("hoy") != 0 && fechaString.indexOf("mañana") != 0 && fechaString.indexOf("el") != 0
}
