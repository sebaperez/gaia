var express = require('express');
var date = require('date-and-time');
var router = express.Router();

router.post('/huecos', function (req, res, next) {
   res.send(req.body[0].desde);
});

module.exports = router;
