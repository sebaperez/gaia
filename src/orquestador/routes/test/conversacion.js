var express = require('express');
var date = require('date-and-time');
var router = express.Router();

//crearConversacion
router.post('/', function (req, res, next) {
    res.send(
      {
         id: 21312321312,
         owner: 'juan.perez@gmail.com',
         guest: "mario.baracus@hotmail.com",
         mensajes: [
           {
               contenido: "solicito una reunion mañana entre las 14hs y 15hs, o tambien puede ser entre jueves y viernes de la semana que viene. Si eso no te queda bien este martes tambien puede ser",
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
                  ]
               }
           }
         ]
      }
    );
});

//agregarMensajeAConversacion
router.put('/:id', function (req, res, next) {
    res.send(
      {
         id: 21312321312,
          owner: 'juan.perez@gmail.com',
          guest: "mario.baracus@hotmail.com",
          mensajes: [
             {
                contenido: "Bien, acepto el horario",
                significado: {
                  "original_response": "PARA DEBUG",
                  "ok": true,
                  "intents": [
                     "aceptar_reunion"
                  ]
                }
             },
             {
                contenido: "Guest, mañana el owner esta libre a las 15hs",
                significado: {
                  "intents": [
                     "proponer_horario"
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
                  ]
                }
             },
             {
                contenido: "solicito una reunion para mañana, pongo en copia a Gaia para que coordine",
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
                   ]
               }
            }
         ]
      });
});

//obtenerConversacion
router.get('/:ownerMail/:guestMail', function (req, res, next) {
    res.send(
      {
         id: 21312321312,
          owner: 'juan.perez@gmail.com',
          guest: "mario.baracus@hotmail.com",
          mensajes: [
             {
                contenido: "Guest, mañana el owner esta libre a las 15hs",
                significado: {
                  "intents": [
                     "proponer_horario"
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
                  ]
                }
             },
             {
                contenido: "solicito una reunion para mañana, pongo en copia a Gaia para que coordine",
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
                   ]
               }
            }
         ]
      });
});

module.exports = router;
