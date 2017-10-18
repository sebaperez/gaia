
var exports = module.exports = {};
const request = require('request');
const moment = require('moment');

var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

var clientSecret = null;
var clientId = null;
var redirectUrl = null;

// Load client secrets from a local file.
fs.readFile('server/client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  console.log(JSON.parse(content))

  credentials = JSON.parse(content);

  clientSecret = credentials.web.client_secret;
  clientId = credentials.web.client_id;
  redirectUrl = credentials.web.redirect_uris[0];

});

//Listar eventos
exports.listar_eventos = function(auth, desde, hasta, callback) {
  var calendar = google.calendar('v3');
  var momentDesde = moment(desde)
  var momentHasta = moment(hasta)
  console.log('A GOOGLE: desde: ' + momentDesde.format('YYYY-MM-DDTHH:mm:ssZ') + " - hasta: " + momentHasta.format('YYYY-MM-DDTHH:mm:ssZ'))
  calendar.events.list({
    auth: auth,
    calendarId: 'primary',
    timeMin: momentDesde.format('YYYY-MM-DDTHH:mm:ssZ'),
    timeMax: momentHasta.format('YYYY-MM-DDTHH:mm:ssZ'),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime'
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      callback(null);
      return;
    }

    var events = response.items;
    callback(events)
  });
}

//Agregar un evento
exports.agregar_evento = function(auth, descripcion, desde, hasta, callback, reject) {
  var calendar = google.calendar('v3');
  calendar.events.insert({
    auth: auth,
    calendarId: 'primary',
    resource: {
      'summary': descripcion,
      'description': 'Reunión registrada por GAIA',
      'start': {
        'dateTime': desde
      },
      'end': {
        'dateTime': hasta
      },
    },
}, function(err, eventoCreado) {
    if (err) {
      console.log('Error: ' + err);
      reject(err)
    }
    console.log('Evento creado: ' + eventoCreado);
    callback(eventoCreado)
  });
}

// Levantar credenciales
exports.load_credential = function(user_id, callback, reject) {

  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
 /*
     //req localhost:3000/api/Clients/iduser por get
  var http = require('http');
  var options = {
  host: 'http://gaiameet.com:3000',
  path: '/api/Clients/'+user_id
  };
  var req = http.get(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
  });*/

  //En Archivo
  token_path = "credentials/" + 300 + ".json"
  fs.readFile(token_path, function(err, token) {
    if (err) {
      console.log(err)
    }
    oauth2Client.credentials = JSON.parse(token);
    oauth2Client.refreshAccessToken(function(err, tokens) {
      if(err){
        //do something with the error
        console.log(err);
        reject('Error en la autenticacion con oAuth.');
      }
      var intervalo = {hora_inicio: 9, hora_fin: 18}
      callback(oauth2Client, intervalo);
    });
  });
}
