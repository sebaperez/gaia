const nodemailer = require("nodemailer");

module.exports = function(app) {

	app.post('/send', (req, res) => {

		console.log("--> to " + req.body.to);
		console.log("--> cc " + req.body.cc);
		console.log("--> from " + req.body.from);
		console.log("--> text " + req.body.text);
		console.log("--> subject " + req.body.subject);
		console.log("--> inReplyTo " + req.body.inReplyTo);

		var smtp = nodemailer.createTransport({
						service: "Zoho",
						auth: {
							user: req.body.from,
							pass: "UTNfrba1"
						}
					});

		smtp.sendMail({
					from: req.body.from,
					to: req.body.to,
					cc: req.body.cc,
					subject: req.body.subject,
					text: req.body.text,
					inReplyTo: req.body.inReplyTo
	 			}, function(error, info){
					if(error){
						console.log(error);
					}else{
						console.log('Message sent: ' + info.response);
					}
		});

		res.status(200).json({"ok":"ok"});

	});

	app.get('/dummy', (req, res) => {
		res.status(200).json({"ok":"ok"});
	});

};
