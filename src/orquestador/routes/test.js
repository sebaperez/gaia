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

module.exports = router;
