var inbox = require("inbox");
var nodemailer = require("nodemailer");
const http = require('http');
const express = require('express');
const bodyParser = require("body-parser");
const getStream = require('get-stream');
const simpleParser = require('mailparser').simpleParser;
const request = require('request')

// Constant Definition
const app = express();
const server_out = http.createServer(app);
const port = process.argv[2] || 4444;

// Middlewares
app.use(bodyParser.json());

// Puntos de entrada REST
require('./api/router')(app);

// Nos ponemos a escuchar... hello!
server_out.listen(port, () => console.log(`Servidor server_out Iniciado en puerto ${port}`));


function get_client(mail){

	var client = inbox.createConnection(993, "imap.zoho.com", {
	  secureConnection: true,
	  auth:{
		      user: mail,
		      pass: "UTNfrba1"
		    }
	});

	client.on("connect", function(){
		console.log("Successfully connected to server");

		client.openMailbox('INBOX', function(error, info){
			if(error) console.log(error);
			if(info) console.log(info);
		});

	});

	client.on("error", function(error){
		console.log("EMAIL CLIENT: Ocurrio un error");
		if(error) console.log(error);
	});

	client.on("new", function(message){
		//console.log("mensaje recibido!! ")
		//console.log(JSON.stringify(message, null, 4))
		var messageStream = client.createMessageStream(message.UID)

		getStream(messageStream).then(str => {
				simpleParser(str, (err, mail)=>{
					// Log por consola del mail recibido
					console.log("---------- mensaje recibido!! ----------")
					console.log(JSON.stringify(mail, null, 4))
					console.log(" ---------- ---------- ---------- ---------- ---------- ----------")
					// Se lo mandamos al orquestador
					// "http://" + process.env.IP + ":5555/mensajes",
					request.post({
							url: "http://" + "45.55.187.250" + ":5555/mensajes",
							json: true,
							body: mail
						     },
						function (error, responde, body){
							console.log("Respuesta del orquestado: ")
							console.log(JSON.stringify(body, null, 4))
						})
					
					/*
					// Respondemos un dummy
					var smtp = nodemailer.createTransport({
						service: "Zoho",
						auth: {
							user: mail.to.text,
							pass: "UTNfrba1"
						}
					});

					smtp.sendMail({
								from: mail.to.text,
								to: mail.from.text,
								subject: mail.subject,
								text: "Por el momento no estamos online, proximamente!",
								inReplyTo: mail.messageId
				 			}, function(error, info){
								if(error){
									console.log(error);
								}else{
									console.log('Message sent: ' + info.response);
								}
					});
					*/
				})
			});

	});

	return client
}

get_client("clara@gaiameet.com").connect();
get_client("paula@gaiameet.com").connect();
get_client("belen@gaiameet.com").connect();
get_client("maria@gaiameet.com").connect();
get_client("esteban@gaiameet.com").connect();

