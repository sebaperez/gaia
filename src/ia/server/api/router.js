const ia_adapter = require('../adapters/wix.js');

module.exports = function(app) {

  app.post('/process', (req, res) => {
	console.log("--> process " + req.body.msj);

    ia_adapter.process(req.body.msj, function(err, respuesta) {

        if (err)
            res.status(500).json(respuesta);

        res.status(200).json(respuesta);
    });

  });

  app.get('/dummy', (req, res) => {

    console.log("--> dummy " + req.body);

    respuesta = "vos me mandaste: " + req.body;

	res.status(200).json(respuesta);
  });

};