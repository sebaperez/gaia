let smtpConfig = {
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
        user: 'username',
        pass: 'password'
    }
};

let transporter = nodemailer.createTransport(smtpConfig)


module.exports = function(app) {

  app.post('/send', (req, res) => {

      console.log("--> to " + req.body.to);
      console.log("--> from " + req.body.from);
      console.log("--> text " + req.body.text);
      console.log("--> subject " + req.body.subject);
      console.log("--> inReplyTo " + req.body.inReplyTo);

      var message = {
          from: from,
          to: to,
          subject: subject,
          text: text,
          inReplyTo: inReplyTo
      };

      transporter.sendMail(message, (err, info) => {

        console.log(JSON.stringify(err, null, 4))
        console.log(JSON.stringify(info, null, 4))

      }])

      res.status(200).json({"ok":"ok"});
  });

  app.get('/dummy', (req, res) => {

    console.log("--> dummy " + req.body);

    respuesta = "vos me mandaste: " + req.body;

	res.status(200).json(respuesta);
  });

};