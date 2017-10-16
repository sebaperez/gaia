var express = require('express');
var date = require('date-and-time');
var router = express.Router();

router.post('/proximodisponible', function (req, res, next) {
   if(!req.query.usuario){
      res.status(400).send("Falta el parametro usuario");
   }
   res.send(req.body[0].desde);
});

module.exports = router;
