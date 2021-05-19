const express = require('express');
var router = express.Router();
const Tension = require('../controllers/tensiones.js');
//import { getTensiones, getTension, createTension, updateTension, deleteTension} from '../controllers/tensiones.js';
router.get('/', Tension.getTensiones);
router.post('/', Tension.createTension);
router.get('/:id', Tension.getTension);
router.patch('/:id', Tension.updateTension);
router.delete('/:id', Tension.deleteTension);

module.exports = router;
