var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsuarioSchema = new Schema({
    id: String,
    nombre: String
});

var UsuarioModel = mongoose.model("Usuario", UsuarioSchema);
module.exports = UsuarioModel;
