var express = require('express');
var date = require('date-and-time');
var router = express.Router();

router.get('/user/api/clientes', function (req, res, next) {
    res.send([
      {
        "name": "Juan",
        "lastname": "Perez",
        "botName": "Gaia",
        "botEmail": "gaia@gaiameet.com",
        "creationDate": date.parse('02-01-2017', 'DD-MM-YYYY'),
        "username": 'juan.perez@gmail.com'
      }
    ]);
});

router.post('/ia/process', function (req, res, next) {
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
});

router.post('/conversacion/conversaciones', function (req, res, next) {
    res.send(
      {
         id: 11312,
         owner: 'juan.perez@gmail.com',
         guests: "mario.baracus@hotmail.com",
         mensajes: [
           {
               contenido: "Te parece si nos juntamos mañana entre las 14hs y 15hs, o tambien puede ser entre jueves y viernes de la semana que viene. Si eso no te queda bien este martes tambien puede ser",
               significado: {
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
                   }
                  ],
               }
           }
         ]
      }
    );
});

module.exports = router;
