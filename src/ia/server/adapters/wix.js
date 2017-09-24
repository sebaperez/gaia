const {Wit, log} = require('node-wit');
const config = require('../config/config.js');

const client = new Wit({
  accessToken: config.wix.TOKEN
});

var exports = module.exports = {};

// Posibles intents: no_identificado, solicitar_reunion, posponer_reunion, cancelar_reunion

// Convierte la respuesta de wix al formato interno de gaia.
function adaptar(data){

    retorno = {}

    retorno.original_response = data

    if (data.entities){
        retorno.ok = true

        retorno.intents = []

        if (data.entities.intent){
            data.entities.intent.forEach((value, index)=>{
                retorno.intents.push(value.value)
            })
        } else {
            //retorno.intents.push("no_identificado")
        }

        retorno.fechas = [];
        retorno.intervalos = [];

        if (data.entities.datetime){
            data.entities.datetime.forEach((value, index)=>{

                if (value.type == "value")
                    retorno.fechas.push({"fecha": value.value});

                if (value.type == "interval")
                    retorno.intervalos.push({"desde": value.from.value, "hasta": value.to.value});

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
        respuesta = adaptar(data);
        callback(null, respuesta)
    })
    .catch(console.error);

};