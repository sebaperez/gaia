var express = require('express');
var router = express.Router();

router.post('/', function (req, res, next) {
    res.send({
        nombreOwner: 'Carlos',
        fecha: new Date()
    });
});

router.get('/contactos', function (req, res, next) {
    res.send([
        {
            nombre: 'Juan',
            mail: 'juan@gmail.com'
        },
        {
            nombre: 'Pedro',
            mail: 'pedro@gmail.com'
        }
    ]);
});

module.exports = router;
