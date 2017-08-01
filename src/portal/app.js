var express = require("express");
var app = express();
var request = require("request");

var USER_HOST = "localhost";
var USER_PORT = 3000;

var user = (function() {
	return {
		cons: {
			HOST: "localhost",
			PORT: 3000
		},
		request: function(method, path, cb) {
			return request.get("http://" + this.cons.HOST + ":" + this.cons.PORT + path, function(res) {
				if (cb) {
					cb(res);
				}
			});
		},
		isDown: function(cb) {
			this.request("GET", "/").on("error", function() {
				cb();
			});
		}
	}
})();

app.get('/', function (req, res) {
	res.send('Hello World!');
});

app.listen(3001, function () {
	user.isDown(function() {
		console.log("Servicio user no esta levantado");
		process.exit();
	});
});

