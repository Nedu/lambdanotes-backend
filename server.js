const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
let env;

if(process.env.NODE_ENV !== 'production') {
  // const env = require(path.join(`(__dirname), './env'`));
  env = require('./env');
} else {
  env = process.env;
}

const server = express();
const corsOptions = {
  origin: 'https://lambda-notes-app.netlify.com/',
  credentials: true,
};

const userRoutes = require('./api/routes/users');
const noteRoutes = require('./api/routes/notes');

const url = env.DATABASE_URL || 'mongodb://localhost/lambdanotesdb';
mongoose.connect(env.DATABASE_URL)
.then(mongo => {
  console.log(`Sucessfully connected to database ${env.DATABASE_URL}`)
})
.catch(err => {
  console.log(`Error connecting to database: ${err}`)
})

// Middlewares
server.use(cors(corsOptions));
server.use(helmet());
server.use(express.json());

// Route Handlers
server.use('/api/v1', userRoutes);
server.use('/api/v1', noteRoutes);

const port = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'testing') {
    server.listen(port, () => console.log(`\n=== API running on port ${port} ===\n`));
}

module.exports = server;