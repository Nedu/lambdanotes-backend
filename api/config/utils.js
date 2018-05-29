const path = require('path');
const env = require(path.join(__dirname, '../../env'));
const mongoose = require('mongoose');
const faker = require('faker');

const User = require('../models/User');

beforeAll(() => {
    return mongoose.connect(env.DATABASE_URL)
        .then(console.log(`connected to test db ${env.DATABASE_URL}`));
});

beforeEach(() => {
    const { userName, password } = faker.internet;
    user = { username: userName(), password: password() }
});

afterEach(() => {
    return User.remove();
});

afterAll(() => {
    return mongoose.disconnect();
});
