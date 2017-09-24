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
    texto = texto.replace(/@fechas/g, body.fechas);
    return texto
  }
}
