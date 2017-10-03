module.exports = {
  parseText:function(respuesta, body, res) {
    var texto = respuesta.contenido
    texto = texto.replace(/@name/g, res.req.body.owner.name);
    var date = new Date(Date.parse(body.fechas))
    var dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Disciembre"]
    texto = texto.replace(/@fechas/g, 'el ' + dias[date.getDay()] + ' ' + date.getDate() + ' de ' + meses[date.getMonth()] + ' a las ' + ((date.getHours() < 10) ? "0" + date.getHours() : date.getHours()) + ':'  + ((date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes()) + ' hs');
    return texto
  }
}
