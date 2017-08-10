// Packages Imports
const http = require('http');
const express = require('express');
const bodyParser = require("body-parser");

// Local Imports
const appConfig = require('./config/config.js');

// Constant Definition
const app = express();
const server = http.createServer(app);
//const port = process.env.PORT || 3000
const port = process.argv[2] || 3001;

// Middlewares
app.use(bodyParser.json());

// Puntos de entrada REST
require('./api/router')(app);

// Nos ponemos a escuchar... hello!
server.listen(port, () => console.log(`Servidor Iniciado en puerto ${port}`));