var express = require('express');
var date = require('date-and-time');
var router = express.Router();

router.get('/user', function (req, res, next) {
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

router.post('/ia', function (req, res, next) {
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
        "inervalos": [
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

module.exports = router;
