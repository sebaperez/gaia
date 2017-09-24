const nodemailer = require("nodemailer");
const sendmail = require('sendmail')();


module.exports = function(app) {

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
          text: req.body.text,
          inReplyTo: req.body.inReplyTo
      };
      
     nodemailer.createTestAccount((err, account) => {

	     let transporter = nodemailer.createTransport({
		             host: 'gaiameet.com',
		             port: 587,
		             secure: false, // true for 465, false for other ports
		             auth: {
				                 user: account.user, // generated ethereal user
				                 pass: account.pass  // generated ethereal password
				             }
		         });


	     let mailOptions = {
		             from: '"Clara" <clara@gaiameet.com>', // sender address
		             to: 'presta.nico@gmail.com, presta_26@hotmail.com', // list of receivers
		             subject: 'Hello ✔', // Subject line
		             text: 'Hello world?', // plain text body
		             html: '<b>Hello world?</b>' // html body
		         };

	     transporter.sendMail(mailOptions, (error, info) => {
		             if (error) {
				                 return console.log(error);
				             }
		             console.log('Message sent: %s', info.messageId);
		             // Preview only available when sending through an Ethereal account
		             console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
		     //
		     //                 // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
		     //                         // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
		                                  });
		                                  });

     res.status(200).json({"ok":"ok"});
  });

  app.get('/dummy', (req, res) => {

    console.log("--> dummy " + req.body);

    respuesta = "vos me mandaste: " + req.body;

	res.status(200).json(respuesta);
  });

};
