var inbox = require("inbox");

var client = inbox.createConnection(false, "imap.zoho.com", {
	  secureConnection: true,
	  auth:{
		      user: "clara@gaiameet.com",
		      pass: "UTNfrba1"
		    }
});

client.on("connect", function(){
	  console.log("Successfully connected to server");
	  client.openMailbox("INBOX", function(error, info){
		      if(error) throw error;
		    });
});

client.on("new", function(message){
	  console.log(message);
});

client.connect();
