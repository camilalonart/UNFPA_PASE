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
    generadorPrincipal:{situacion: String, actores: String, odsPrincipal:String, metaPrincipal: String, dimensiones:String},
    generadores:[{situacion: String, actores: String, odsPrincipal:String, metaPrincipal: String, dimensiones:String}],
    implicacionPrincipal:{efectos: String, odsPrincipal: String, metaPrincipal: String, dimensiones:String},
    implicaciones:[{efectos: String, odsPrincipal: String, metaPrincipal: String, dimensiones:String}],
    reforzadores:[{situacion: String, odsPrincipal: String, metaPrincipal: String, dimensiones:String}],
    reforzadorPrincipal:{situacion: String, odsPrincipal: String, metaPrincipal: String, dimensiones:String},
    liberadores:[{situacion: String, odsPrincipal: String, metaPrincipal: String, dimensiones:String}],
    liberadorPrincipal:{situacion: String, odsPrincipal:String, metaPrincipal: String, dimensiones:String},
    valoracionTensiones:{intensidad: Number, impacto: Number, cronicidad: Number, ingobernabilidad: Number},
    balanceGeneral:Number,
    balanceTotal:Number,
    narrativa:String,
    createdAt: {
        type: Date,
        default: new Date(),
    },
})

module.exports = mongoose.model(' TensionesSchema',  tensionesSchema);