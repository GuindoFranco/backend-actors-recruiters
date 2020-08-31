const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');

const port = 3000;

const app = express();

app.use('/auth', authRoutes);

mongoose
  .connect(
    "mongodb+srv://usrTalentApp:SEAikcSKnUK2Y93@cluster0.zy1bb.mongodb.net/<dbname>?retryWrites=true&w=majority"
  )
  .then(result => {
    app.listen(port);
    console.log(`Conectado en el puerto: ${port}`);
  })
  .catch((err) => {
    console.log(err);
  });
