const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');

const env = require('./env');

const server = express();
const corsOptions = {
  origin: 'https://lambda-notes-app.netlify.com/',
  credentials: true,
};

// const userRoutes = require('./routes/users');
// const noteRoutes = require('./routes/notes');

const url = env.DATABASE_URL || 'mongodb://localhost/lambdanotesdb';
mongoose.connect(env.DATABASE_URL)
.then(mongo => {
  console.log(`Sucessfully connected to database ${process.env.DATABASE_URL}`)
})
.catch(err => {
  console.log(`Error connecting to database: ${err}`)
})

// Middlewares
server.use(cors(corsOptions));
server.use(helmet());
server.use(express.json());

// Route Handlers
// server.use('/api/', authRoutes);
// server.use('/api/', noteRoutes);

const port = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
    server.listen(port, () => console.log(`\n=== API running on port ${port} ===\n`));
}

module.exports = server;