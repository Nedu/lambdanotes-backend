const routes = require('express').Router();

const { authenticate, protected } = require('../config/auth');
const users = require('../controllers/users.js');

routes.post('/register', users.register);
routes.post('/login', authenticate, users.login);
routes.get('/users', protected, users.findAll);

module.exports = routes;