var express = require('express');
var router = express.Router();
var usuarioService = require('../service/usuario');
var iaService = require('../service/ia');

router.post('/', function (req, res, next) {

   usuarioService.obtenerUsuario(req.body.de, function (usuario) {

      iaService.interpretarMensaje(req.body.contenido, function (significado) {

         res.send(significado)
         //Crear conversacion

      });

   });


});

module.exports = router;
