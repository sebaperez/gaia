var express = require('express');
var date = require('date-and-time');
var router = express.Router();

router.post('/solicitarReunionAlGuest/parser', function (req, res, next) {
   res.send("Mario, te parece coordinar la reunion para " + req.body.hueco + "?");
});

router.post('/confirmarReunion/parser', function (req, res, next) {
   res.send("La reunion queda agendada para el " + req.body.hueco + ". Gracias");
});

router.post('/error/parser', function (req, res, next) {
   res.send("Lo siento, en este momento no estoy disponible. Gracias");
});

module.exports = router;
