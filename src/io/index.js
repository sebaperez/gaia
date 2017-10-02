var inbox = require("inbox");
var nodemailer = require("nodemailer");

var smtp = nodemailer.createTransport({
	  service: "Zoho",
	  auth: {
		      user: "clara@gaiameet.com",
		      pass: "UTNfrba1"
		    }
});
  smtp.sendMail({
	      from: "clara@gaiameet.com",
	      to: "presta.nico@gmail.com",
	      subject: "Hello world!",
	      html: "Welcome!"
	    }, function(error, info){
		        if(error){
				      console.log(error);
				    }else{
					          console.log('Message sent: ' + info.response);
					        }
		      });

/*
var client = inbox.createConnection(993, "imappro.zoho.com", {
	  secureConnection: true,
	  auth:{
		      user: "clara@gaiameet.com",
		      pass: "UTNfrba1"
		    }
});

client.on("connect", function(){
	  console.log("Successfully connected to server");
	  
	  client.openMailbox('INBOX', function(error, info){
		      if(error) 
			  console.log(error);
		    });
});

client.on("new", function(message){
	  console.log(message.from.address + " - " + message.title);

	  smtp.sendMail({
		      from: "clara@gaiameet.com",
		      to: message.from.address,
		      subject: "Hello world!",
		      html: "Welcome!"
		    }, function(error, info){
			        if(error){
					      console.log(error);
					    }else{
						          console.log('Message sent: ' + info.response);
						        }
			      });

});

<<<<<<< HEAD
client.connect();

*/
=======
// Middlewares
app.use(bodyParser.json());

// Puntos de entrada REST
require('./api/router')(app);

// Nos ponemos a escuchar... hello!
server_out.listen(port, () => console.log(`Servidor server_out Iniciado en puerto ${port}`));
>>>>>>> ece12654e05cdea6100e02820df733d82e3b8442
