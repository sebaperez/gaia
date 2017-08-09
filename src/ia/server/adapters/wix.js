const {Wit, log} = require('node-wit');
const config = require('../config/config.js');

const client = new Wit({
  accessToken: config.wix.TOKEN
});

var exports = module.exports = {};

// Convierte la respuesta de wix al formato interno de gaia.
function adaptar(data){

    retorno = {}

    retorno.original_response = data

    if (data.entities){
        retorno.ok = true

        if (data.entities.intent){
            data.entities.intent.forEach((value, index)=>{
                retorno.intent = value.value
            })

        } else {
            retorno.intent = "no_identificado"
        }

        retorno.fecha_propuesta = []

        if (data.entities.datetime){
            data.entities.datetime.forEach((value, index)=>{
                retorno.fecha_propuesta.push(value.value)
            })

        }

    } else {
        retorno.ok = false
    }

    return retorno
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