var express = require('express');
var date = require('date-and-time');
var router = express.Router();

router.post('/send', function (req, res, next) {
   console.log(req.body);
   res.status(200).send();
});

module.exports = router;
