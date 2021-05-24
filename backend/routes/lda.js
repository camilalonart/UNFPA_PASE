const express = require('express');

const LDA = require('../controllers/lda.js');

const router = express.Router();

router.get('/', LDA.get);

module.exports = router;


