/*import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import tensionRoutes from './routes/tensiones.js';
import ldaRoutes from './routes/lda.js';


const app = express();

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());

app.use('/tensiones', tensionRoutes);
app.use('/lda', ldaRoutes);


const CONNECTION_URL = 'mongodb+srv://admin:admin@cluster0.nftkv.mongodb.net/tensiones?retryWrites=true&w=majority';
const PORT = process.env.PORT|| 5002;


mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set('useFindAndModify', false);*/

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const tensionRoutes = require('./routes/tensiones');
const ldaRoutes = require('./routes/lda');

const app = express();

app.use(cors());

app.use('/tensiones', tensionRoutes);
app.use('/lda', ldaRoutes);


const CONNECTION_URL = 'mongodb+srv://admin:admin@cluster0.wtdy3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const PORT = process.env.PORT|| 5000;


mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set('useFindAndModify', false);