var express = require('express');
var router = express.Router();
var usuarioService = require('../service/usuario');

router.post('/', function (req, res, next) {
  usuarioService.obtenerUsuario(function (usuario) {
    res.send(usuario);
  });
});

module.exports = router;
