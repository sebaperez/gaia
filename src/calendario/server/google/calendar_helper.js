
var exports = module.exports = {};
const request = require('request');

var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

var clientSecret = null;
var clientId = null;
var redirectUrl = null;

// Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
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

// Funciones utiles para comunicarse con google.
exports.listar_eventos = function(auth, desde, hasta, callback) {
  var calendar = google.calendar('v3');
  //console.log(auth)
  calendar.events.list({
    auth: auth,
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
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

// Levantar credenciales
exports.load_credential = function(user_id, callback) {

  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  var http = require('http');
  var options = {
  host: 'http://gaiameet.com:3000',
  path: '/api/Clients/'+user_id
  };
  var req = http.get(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
  });
  //En Archivo
  /*token_path = "../credentials/" + user_id + ".json"
  fs.readFile(token_path, function(err, token) {
    if (err) {
      console.log(err)
    }
      oauth2Client.credentials = JSON.parse(token);
      oauth2Client.refreshAccessToken(function(err, tokens){
        if(err){
      //do something with the error
      console.log(err);
      return reject('error in authenticating calendar oAuth client.');  }*/
      callback(oauth2Client);
    };


// Listar eventos
