const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const questionsRouter = require('./routes/questions_router');

const app = express();
app.use(express.json());
app.use(cors());

const mongoUri = 'mongodb://127.0.0.1:27017/fake_so';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

app.use('/routes', questionsRouter);


const server = app.listen(8000, () => console.log('Server started on https://localhost:8000'));

process.on('SIGINT', () => {
  db.close(() => {
    console.log('Server closed. Database instance disconnected');
    process.exit(0);
  });
});

module.exports = server;