const SMTPServer = require('smtp-server').SMTPServer;
const getStream = require('get-stream');
const simpleParser = require('mailparser').simpleParser;
const request = require('request');

const server = new SMTPServer({
        authOptional: true,

	onData(stream, session, callback){
		const chunks = [];
		getStream(stream).then(str => {
			//console.log(str);
			simpleParser(str, (err, mail)=>{
				console.log(JSON.stringify(mail, null, 4))
				request.post({
					url: "localhost:5000/mensajes",
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


