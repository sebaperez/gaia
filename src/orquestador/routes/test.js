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

//crearConversacion
router.post('/conversacion', function (req, res, next) {
    res.send(
      {
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
router.put('/conversacion/:ownerMail/:guestMail', function (req, res, next) {
    res.send(
      {
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

router.post('/calendario/huecos', function (req, res, next) {
   res.send([req.body[0].desde]);
});

router.post('/respuesta/solicitarReunionAlGuest/parser', function (req, res, next) {
   res.send("Mario, te parece coordinar la reunion para " + req.body.hueco + "?");
});

router.post('/respuesta/confirmarReunion/parser', function (req, res, next) {
   res.send("La reunion queda agendada para el " + req.body.hueco + ". Gracias");
});

router.post('/io/send', function (req, res, next) {
   console.log(req.body);
   res.status(200).send();
});

module.exports = router;
