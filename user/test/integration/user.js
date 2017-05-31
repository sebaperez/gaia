var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app.js');
var should = chai.should();

chai.use(chaiHttp);

describe("Tests de integracion de user", function() {
	it("Crear user por POST y obtenerlo por GET", function() {
		var data = {
			"name": "Testname",
			"lastname": "Testlastname",
			"email": "test@test.com"
		}, _id;
		chai.request(server).post("/user").send(data).end(function(err, res) {
			res.should.have.status(200);
			res.body.should.be.a('object');
			res.body.should.have.property('_id');
			res.body.should.have.property('name').eql(data.name);
			res.body.should.have.property('lastname').eql(data.lastname);
			res.body.should.have.property('email').eql(data.email);
			_id = res.body._id;
		});
		chai.request(server).get("/user/" + _id).end(function(err, res) {
			res.should.have.status(200);
			res.body.should.be.a('object');
			res.body.should.have.property('_id');
			res.body.should.have.property('name').eql(data.name);
			res.body.should.have.property('lastname').eql(data.lastname);
			res.body.should.have.property('email').eql(data.email);		
		});
	});

	it("GET sin id falla", function() {
		chai.request(server).get("/user").end(function(err, res) {
			res.should.have.status(404);
		});
	});
});
