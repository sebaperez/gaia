module.exports = function(app) {

  app.post('/newmail', (req, res) => {

      console.log("--> sender " + req.body.sender);
      console.log("--> size " + req.body.size);
      console.log("--> recipient " + req.body.recipient);
      
      res.status(200).json({"ok":"ok"});
  });

  app.get('/dummy', (req, res) => {

    console.log("--> dummy " + req.body);

    respuesta = "vos me mandaste: " + req.body;

	res.status(200).json(respuesta);
  });

};