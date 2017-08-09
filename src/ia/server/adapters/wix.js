const {Wit, log} = require('node-wit');
const config = require('../config/config.js');

const client = new Wit({
  accessToken: config.wix.TOKEN
});

var exports = module.exports = {};

// Convierte la respuesta de wix al formato interno de gaia.
function adaptar(data){
    return data
}

exports.process = function(msj, callback) {

    client.message(msj, {})
    .then((data) => {
      console.log('----> Wit nos responde: ' + JSON.stringify(data));
        respuesta = adaptar(data)
        callback(null, respuesta)
    })
    .catch(console.error);

};