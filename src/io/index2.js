const SMTPServer = require('smtp-server').SMTPServer;
const getStream = require('get-stream');
const simpleParser = require('mailparser').simpleParser;
const request = require('request'); 

// Packages Imports
const http = require('http');
const express = require('express');
const bodyParser = require("body-parser");

// Constant Definition
const app = express();
const server_out = http.createServer(app);
//const port = process.env.PORT || 3000
const port = process.argv[2] || 4444;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const server = new SMTPServer({
        authOptional: true,
        allowInsecureAuth: true,
	direct: true,
	onData(stream, session, callback){
		console.log("--> on data")

		// Obtener data del email
		getStream(stream).then(str => {
			simpleParser(str, (err, mail)=>{
				// Log por consola del mail recibido
				console.log(JSON.stringify(mail, null, 4))

				// Se lo mandamos al orquestador
				request.post({
						url: "http://" + process.env.IP + ":5555/mensajes",
						json: true,
						body: mail
					     },
					function (error, responde, body){
						console.log(JSON.stringify(body, null, 4))
					})

				// Fin del procesamiento del mail
				callback()
			})
		});
	},

	onAuth(auth, session, callback){
		console.log("--> on auth")

                //if(auth.username !== 'clara' || auth.password !== 'clara'){
	        //    return callback(new Error('Invalid username or password'));
	        //}
		
		callback(null, {user: 123}); // where 123 is the user id or similar property
	},

	onConnect(session, callback){
		console.log("--> on connect")
		return callback(); // Accept the connection
	},

	onMailFrom(address, session, callback){
        	console.log('--> Nuevo mail desde %s', address.address)

		if(address.address.split("@")[1] !== 'gmail.com'){
			return callback(new Error('Only xxx@gmail.com is allowed to send mail'));
		}

        	return callback(); // Accept the address
    	},

	onClose(session){ 
		console.log("--> on close") 
	},

	onRcptTo(address, session, callback){
		console.log('--> on rcpt to')
		return callback();
	}
});

server.on('error', err => {
	console.log('Error:  %s', err.message);
});

server.listen(25,"gaiameet.com",callback => { console.log("estamos ok") } );


// Middlewares
app.use(bodyParser.json());

// Puntos de entrada REST
require('./api/router')(app);

// Nos ponemos a escuchar... hello!
server_out.listen(port, () => console.log(`Servidor server_out Iniciado en puerto ${port}`));


