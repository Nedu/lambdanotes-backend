const routes = require('express').Router();

const { authenticate, restricted } = require('../config/auth');
const users = require('../controllers/users.js');

routes.post('/register', users.register);
routes.post('/login', authenticate, users.login);
routes.get('/logout', users.logout);
routes.get('/users', restricted, users.findAll);

module.exports = routes;