var express = require('express');
var app = express();
var mongo = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var db;

app.use(bodyParser.json());

var CODE_NOT_FOUND = 404;
var CODE_OK = 200;
var CODE_ERROR = 500;

app.all('/', function(req, res) {
	res.status(CODE_NOT_FOUND);
});

app.get('/user/:id', function (req, res) {
	var id = req.params.id;
	if (id) {
		db.collection("user").find().toArray(function(err, result) {
			res.status(CODE_OK).send(JSON.stringify(result));
		});
	} else {
		res.status(CODE_NOT_FOUND);
	}
});

app.post('/user', function(req, res) {
	var data = {
		name: req.query.name,
		lastname: req.query.lastname,
		email: req.query.email
	};
	db.collection("user").save(data, function(err, result) {
		if (!err) {
			res.status(CODE_OK).send(JSON.stringify(data));
		} else {
			res.status(CODE_ERROR);
		}
	});
});

mongo.connect('mongodb://localhost', function(err, database) {
	if (!err) {
		db = database;
		app.listen(3000, function () {
			console.log('Running on 3000');
		});
	}
});

module.exports = app;
