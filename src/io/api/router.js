const nodemailer = require("nodemailer");
const sendmail = require('sendmail')();
var email = require('mailer');
var smtpTransport = require('nodemailer-smtp-transport');


module.exports = function(app) {

  app.post('/send2', (req, res) => {
  
	  var transporter = nodemailer.createTransport(smtpTransport({
		     host: 'mail.gaiameet.com',
		     port: 25,
		     debug: true,
		     secure: false
	  }));

	  transporter.sendMail({
		     from: 'clara@gaiameet.com',
		     to: 'presta.nico@gmail.com',
		     subject: 'hello',
		     html: '<b>hello world!</b>',
		     text: 'hello world!'
	  }, (error, info) => {
	  	 if (error) {
			             console.log('----> Error occurred on email send');
			             console.log(error.message);
			    }

		          console.log('----> Message sent successfully!');
		          console.log(nodemailer.getTestMessageUrl(info));

		          // only needed when using pooled connections
		  	   transporter.close();

	  });
  })

  app.post('/send', (req, res) => {

      console.log("--> to " + req.body.to);
      console.log("--> from " + req.body.from);
      console.log("--> text " + req.body.text);
      console.log("--> subject " + req.body.subject);
      console.log("--> inReplyTo " + req.body.inReplyTo);

      var message = {
          from: req.body.from,
          to: req.body.to,
          subject: req.body.subject,
          text: req.body.text //,
        //  inReplyTo: req.body.inReplyTo
      };

      var transporter = nodemailer.createTransport('smtps://clara:UTNfrba1@smtp.gmail.com');

	//	transporter = nodemailer.createTransport({
	//	    	service: 'Gmail',
	//   		auth: {
	//	            user: 'clara@gaiameet.com',
	//	            pass: 'UTNfrba1'
	//	        }
	//		});
		let mailOptions = {
		             from: 'clara@gaiameet.com', // sender address
		             to: 'presta.nico@gmail.com', // list of receivers
		             subject: 'Hello', // Subject line
		             text: 'Hello world?', // plain text body
		             html: '<b>Hello world?</b>' // html body
		         };

	     transporter.sendMail(mailOptions, (error, info) => {
		             if (error) {
				                 return console.log(error);
				             }
		             console.log('Message sent: %s', info.messageId);
		         });

     res.status(200).json({"ok":"ok"});
  });

  app.get('/dummy', (req, res) => {

	email.send({  
	  	host : "gaiameet.com",              // smtp server hostname
	  	port : "25",                     // smtp server port
	  	domain : "gaiameet.com",            // domain used by client to identify itself to server
	  	to : "presta.nico@gmail.com",
	  	from : "clara@gaiameet.com",
	  	subject : "node_mailer test email",
	 	body: "Hello! This is a test of the node_mailer.",
	  	authentication : "no",        // auth login is supported; anything else is no auth
	  	username : "clara",       // Base64 encoded username
	  	password : "clara"        // Base64 encoded password
	},

	function(err, result){  
		  if(err){ console.log(err); }
	});

	res.status(200).json({"ok":"ok"});
  });

};
