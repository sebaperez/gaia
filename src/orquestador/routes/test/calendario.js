var express = require('express');
var date = require('date-and-time');
var router = express.Router();

router.post('/proximodisponible', function (req, res, next) {
   if(!req.query.usuario){
      res.status(400).send("Falta el parametro usuario");
   }
   res.send(req.body[0].desde);
});

router.post('/agregarEvento', function (req, res, next) {
   if(!req.query.usuario){
      res.status(400).send("Falta el parametro usuario");
   }
   if(req.body.description && req.body.fecha_desde && req.body.fecha_hasta){
      res.status(200).send();
   } else {
      res.status(500).send();
   }
});

module.exports = router;
