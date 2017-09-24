module.exports = {
  parseText:function(respuesta, body) {
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
    var owner = JSON.parse(body.owner)
    Object.keys(owner).map(function(atributo){
      var replace = new RegExp('@' + atributo,"g");
      texto = texto.replace(replace, owner[atributo]);
    })
    texto = texto.replace(/@fechas/g, body.fechas);
    return texto
  }
}
