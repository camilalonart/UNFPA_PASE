var mongoose = require('mongoose');

var tensionesSchema = new mongoose.Schema({
    dimension: String,
    dimensionEspecifica: String,
    competencia: String,
    evento: {
        quepasa: String,
        cuanto: String,
        donde: String,
        hacecuanto: String,
        ods: String,
        meta: String,
    },
    generadorPrincipal:{situacion: String, actores: String, odsPrincipal:String, metaPrincipal: String, dimensiones:[]},
    generadores:[{situacion: String, actores: String, odsPrincipal:String, metaPrincipal: String, dimensiones:[]}],
    implicacionPrincipal:{efectos: String, odsPrincipal: String, metaPrincipal: String, dimensiones:[]},
    implicaciones:[{efectos: String, odsPrincipal: String, metaPrincipal: String, dimensiones:[]}],
    reforzadores:[{situacion: String, odsPrincipal: String, metaPrincipal: String, dimensiones:[]}],
    reforzadorPrincipal:{situacion: String, odsPrincipal: String, metaPrincipal: String, dimensiones:[]},
    liberadores:[{situacion: String, odsPrincipal: String, metaPrincipal: String, dimensiones:[]}],
    liberadorPrincipal:{situacion: String, odsPrincipal:String, metaPrincipal: String, dimensiones:[]},
    valoracionTensiones:{intensidad: Number, impacto: Number, cronicidad: Number, ingobernabilidad: Number},
    createdAt: {
        type: Date,
        default: new Date(),
    },
})

module.exports = mongoose.model(' TensionesSchema',  tensionesSchema);