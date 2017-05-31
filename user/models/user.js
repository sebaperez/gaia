var mongoose = require('mongoose'), Schema = mongoose.Schema;

var userSchema = new Schema({
	name: { type: String },
	lastname: { type: String },
	email: { type: String }
});

module.exports = mongoose.model('user', userSchema);
