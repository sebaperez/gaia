var express = require('express');
var date = require('date-and-time');
var router = express.Router();

router.post('/process', function (req, res, next) {
   if(req.body.msj.indexOf('solicito') > -1){
      res.send(
         {
           "original_response": "PARA DEBUG",
           "ok": true,
           "intents": [
              "solicitar_reunion"
           ],
           "fechas": [{
              "fecha": "2017-08-22T00:00:00.000-03:00"
           }],
           "intervalos": [
             {
                "desde": "2017-08-22T14:00:00.000-03:00",
                "hasta": "2017-08-22T15:00:00.000-03:00"
             },
             {
                "desde": "2017-08-17T00:00:00.000-03:00",
                "hasta": "2017-09-02T00:00:00.000-03:00"
             }],
         }
      );
   } else if (req.body.msj.indexOf('acepto') > -1){
      res.send(
         {
           "original_response": "PARA DEBUG",
           "ok": true,
           "intents": [
              "aceptar_reunion"
           ]
         }
      );
   }
   else {
      res.send("No entendi la intencion");
   }

});

module.exports = router;
