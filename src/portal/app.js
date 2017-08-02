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
		data: {
			sessions: {}
		},
		get: function(path, cb) {
			return this.request("get", path, cb);
		},
		post: function(path, data, cb) {
			return this.request("post", path, data, cb);
		},
		request: function(method, path, data, cb) {
			var url = "http://" + this.cons.HOST + ":" + this.cons.PORT + path;
			if (method === "get") {
				return request.get(url, function(res) {
					if (cb) {
						cb(res);
					}
				});
			} else if (method === "post") {
				return request.post({
					url: url,
					form: data
				}, function(error, response, body) {
					if (cb) {
						cb(error, response, body);
					}
				});
			}
		},
		isDown: function(cb) {
			this.get("/").on("error", function() {
				cb();
			});
		},
		replaceMacros: function(string, query) {
			var macros = {
				"{userId}": function() {
					if (query.accessToken && user.data.sessions[query.accessToken]) {
						return user.data.sessions[query.accessToken].userId;
					} else {
						return "";
					}
				}
			}, i;
			if (string) {
				for (i in macros) {
					string = string.replace(i, macros[i]());
				}
			}
			return string || "";
		},
		register: function(method, local, endMethod, endpoint, cb) {
			app[method](local, function(req, res) {
				endpoint = user.replaceMacros(endpoint, req.query);
				if (endMethod === "post") {
					user.post(endpoint, req.query, function(error, response, body) {
						if (cb) {
							cb(error, response, body, res);
						} else {
							res.send(body);
						}
					});
				} else {
console.log(endpoint);
					user.get(endpoint, function(error, response, body) {
console.log(response);
						if (cb) {
							cb(error, response, body, res);
						} else {
							res.send(body);
						}
					});
				}
			});
		}
	}
})();

user.register("get", "/user/login", "post", "/api/Clients/login", function(error, response, body, res) {
	var d = JSON.parse(body);
	if (d && !d.error && d.id && d.userId) {
		user.data.sessions[d.id] = {
			userId: d.userId
		};
		res.send(JSON.stringify({"accessToken": d.id}));
	} else {
		res.send(body);
	}
});
user.register("get", "/user/register", "post", "/api/Clients");
user.register("get", "/user/logout", "post", "/api/Clients/logout");
user.register("get", "/user/info", "get", "/api/Clients/{userId}");

app.get('/', function (req, res) {
	res.send('');
});

app.listen(3001, function () {
	user.isDown(function() {
		console.log("Servicio user no esta levantado");
		process.exit();
	});
	console.log("Iniciado servicio portal");
});

