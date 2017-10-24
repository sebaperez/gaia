var express = require('express');
var date = require('date-and-time');
var router = express.Router();

router.get('/api/clientes', function (req, res, next) {
    res.send([
      {
        "id": "59c14609ff49692cd6ba21d1",
        "name": "Seba",
        "lastname": "Perez",
        "botName": "Gaia",
        "botEmail": "gaia@gaiameet.com",
        "creationDate": date.parse('02-01-2017', 'DD-MM-YYYY'),
        "email": 'sebalanus@gmail.com'
      }
    ]);
});

module.exports = router;
