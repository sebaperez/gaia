// Packages Imports
const http = require('http');
const express = require('express');
const bodyParser = require("body-parser");

// Constant Definition
const app = express();
const server = http.createServer(app);
//const port = process.env.PORT || 3000
const port = process.argv[2] || 3090;

// Middlewares
app.use(bodyParser.json());

// Puntos de entrada REST
require('./api/router')(app);

// Nos ponemos a escuchar... hello!
server.listen(port, () => console.log(`Servidor Iniciado en puerto ${port}`));