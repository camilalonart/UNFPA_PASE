const express = require('express');
const mongoose = require('mongoose');
const TensionesSchema = require('../models/tensionesSchema.js');

const router = express.Router();

router.getTensiones = async (req, res) => { 
    try {
        const  TensionSchema = await  TensionesSchema.find();
                
        res.status(200).json( TensionSchema);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

router.getTension = async (req, res) => { 
    const { id } = req.params;

    try {
        const post = await  TensionesSchema.findById(id);
        
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

router.createTension = async (req, res) => {
    const {dimension,
        dimensionEspecifica,
        competencia,
        evento,
        generadorPrincipal,
        implicacionPrincipal,
        reforzadorPrincipal,
        liberadorPrincipal,
        generadores,
        implicaciones,
        reforzadores,
        liberadores, 
        valoracionTensiones,
        balanceGeneral,
        balanceTotal,
        narrativa,
    } = req.body;

    const newTension = new  TensionesSchema({ dimension,
        dimensionEspecifica,
        competencia,
        evento,
        generadorPrincipal,
        implicacionPrincipal,
        reforzadorPrincipal,
        liberadorPrincipal,
        generadores,
        implicaciones,
        reforzadores,
        liberadores, 
        valoracionTensiones,
        balanceGeneral,
        balanceTotal,
        narrativa,})

    try {
        await newTension.save();

        res.status(201).json(newTension );
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

router.updateTension = async (req, res) => {
    const { id } = req.params;
    const { dimension,
        dimensionEspecifica,
        competencia,
        evento,
        generadorPrincipal,
        implicacionPrincipal,
        reforzadorPrincipal,
        liberadorPrincipal,
        generadores,
        implicaciones,
        reforzadores,
        liberadores, 
        valoracionTensiones,
        balanceGeneral,
        balanceTotal,
        narrativa,} = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No hay tension con id ${id}`);

    const updatedPost = { dimension,
        dimensionEspecifica,
        competencia,
        evento,
        generadorPrincipal,
        implicacionPrincipal,
        reforzadorPrincipal,
        liberadorPrincipal,
        generadores,
        implicaciones,
        reforzadores,
        liberadores,
        valoracionTensiones,
        balanceGeneral,
        balanceTotal,
        narrativa, 
        _id: id };

    await  TensionesSchema.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
}

router.deleteTension = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No hay tension con id: ${id}`);

    await  TensionesSchema.findByIdAndRemove(id);

    res.json({ message: "Tension borrada de manera exitosa." });
}


module.exports = router;

