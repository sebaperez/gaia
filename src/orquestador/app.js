var express = require('express');
var path = require('path');
var morganBody = require('morgan-body');
var bodyParser = require('body-parser');

var app = express();

//app.use(logger('tiny'));
morganBody(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


var mensajesRoute = require('./routes/mensajesRoute');
app.use('/mensajes', mensajesRoute);

/////TEST ROUTERS//////
var usuarioTestRouter = require('./routes/test/usuario');
app.use('/test/user', usuarioTestRouter);
var iaTestRouter = require('./routes/test/ia');
app.use('/test/ia', iaTestRouter);
var conversacionTestRouter = require('./routes/test/conversacion');
app.use('/test/conversacion', conversacionTestRouter);
var calendarioTestRouter = require('./routes/test/calendario');
app.use('/test/calendario', calendarioTestRouter);
var respuestaTestRouter = require('./routes/test/respuesta');
app.use('/test/respuesta', respuestaTestRouter);
var ioTestRouter = require('./routes/test/io');
app.use('/test/io', ioTestRouter);
/////TEST ROUTERS//////


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
