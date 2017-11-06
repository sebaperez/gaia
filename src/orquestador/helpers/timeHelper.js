var moment = require('moment');
moment.locale('es')
process.env.TZ = 'America/Buenos_Aires'

module.exports.restarIntervalo = function (intervalo, intervaloAExcluir){
   var resultado = []
   var desde = moment(intervalo.desde)
   var hasta = moment(intervalo.hasta)
   var desdeExcluir = moment(intervaloAExcluir.desde)
   var hastaExcluir = moment(intervaloAExcluir.hasta)
   if(desde.isBefore(desdeExcluir) && hasta.isAfter(desdeExcluir)){
      resultado.push({
         desde: desde.format('YYYY-MM-DDTHH:mm:ssZ'),
         hasta: desdeExcluir.format('YYYY-MM-DDTHH:mm:ssZ')
      })
      if(hasta.isAfter(hastaExcluir)){
         resultado.push({
            desde: hastaExcluir.format('YYYY-MM-DDTHH:mm:ssZ'),
            hasta: hasta.format('YYYY-MM-DDTHH:mm:ssZ')
         })
      }
   } else {
      if (hasta.isAfter(hastaExcluir) && desde.isBefore(hastaExcluir)) {
         resultado.push({
            desde: hastaExcluir.format('YYYY-MM-DDTHH:mm:ssZ'),
            hasta: hasta.format('YYYY-MM-DDTHH:mm:ssZ')
         })
      } else {
         resultado.push({
            desde: desde.format('YYYY-MM-DDTHH:mm:ssZ'),
            hasta: hasta.format('YYYY-MM-DDTHH:mm:ssZ')
         })
      }
   }
   return resultado
}
