import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import authRoutes from './routes/auth';

const port = 3000;

const app = express();

app.use(bodyParser.json());

app.use('/auth', authRoutes);

app.use((error: any, req: any, res: any, next: Function) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    "mongodb+srv://usrTalentApp:SEAikcSKnUK2Y93@cluster0.zy1bb.mongodb.net/devDataBase?retryWrites=true&w=majority"
  )
  .then(result => {
    app.listen(port);
    console.log(`Conectado en el puerto: ${port}`);
  })
  .catch((err) => {
    console.log(err);
  });
