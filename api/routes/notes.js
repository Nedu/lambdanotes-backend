const routes = require('express').Router();
 
const { authenticate, restricted } = require('../config/auth');
const notes = require('../controllers/notes.js');
 
routes.get('/notes', restricted, notes.findAll);
routes.get('/notes/:id', restricted, notes.findOne);
routes.post('/notes', restricted, notes.create);
routes.put('/notes/:id', restricted, notes.update);
routes.delete('/notes/:id', restricted, notes.delete);

module.exports = routes;