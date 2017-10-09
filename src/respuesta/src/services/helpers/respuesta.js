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
    texto = texto.replace(/@name/g, res.req.body.owner.name);
    console.log("La fecha para agendar es: " + body.hueco)
    var date = new Date(Date.parse(body.hueco))
    var dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Disciembre"]
    texto = texto.replace(/@fechas/g, 'el ' + dias[date.getDay()] + ' ' + date.getDate() + ' de ' + meses[date.getMonth()] + ' a las ' + ((date.getHours() < 10) ? "0" + date.getHours() : date.getHours()) + ':'  + ((date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes()) + ' hs');
    return texto
  }
}
