var mongoose = require('mongoose');

var ldaSchema = new mongoose.Schema({
    idPregunta: String,
    pregunta: String,	
    rangoEdad: String,
    respuesta: String,	
    sexo: String, 
    palabra: String,
    ods: String,
    meta: String,
    mesTexo: String,
    anio: String, 
})


module.exports = mongoose.model(' LDASchema',  ldaSchema);