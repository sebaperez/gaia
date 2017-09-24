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


const server = new SMTPServer({
        authOptional: true,

	onData(stream, session, callback){
		const chunks = [];
		getStream(stream).then(str => {
			//console.log(str);
			simpleParser(str, (err, mail)=>{
				console.log(JSON.stringify(mail, null, 4))
				request.post({
					url: "http://" + process.env.IP + ":5555/mensajes",
					json: true,
					body: mail},
				function (error, responde, body){
					console.log(JSON.stringify(body, null, 4))
				})
				callback()
			})
		});

		//stream.on("data", function (chunk) {
		//	chunks.push(chunk);
		//	console.log(chunk);
	        //});

		//console.log(msj_str)
		//stream.pipe(process.stdout); // print message to console
		//stream.on('end', fin => {
		//	console.log(Buffer.concat(chunks))
		//	callback()
		//});
	},

	onAuth(auth, session, callback){
		console.log("on auth")
		callback(null, {user: 123}); // where 123 is the user id or similar property
	},

	onConnecit(session, callback){
		console.log("on connect")
		return callback(); // Accept the connection
	},

	onMailFrom(address, session, callback){
        	console.log('Nuevo mail desde %s', address.address)
        	return callback(); // Accept the address
    	},

	onClose(session){ 
		console.log("close") 
	},

	onRcptTo(address, session, callback){
		console.log('on rcpt to')
		return callback();
	}
});

server.on('error', err => {
	    console.log('Error %s', err.message);
});

server.listen(25,"gaiameet.com",callback => { console.log("estamos ok") } );



// Middlewares
app.use(bodyParser.json());

// Puntos de entrada REST
require('./api/router')(app);

// Nos ponemos a escuchar... hello!
server_out.listen(port, () => console.log(`Servidor server_out Iniciado en puerto ${port}`));


