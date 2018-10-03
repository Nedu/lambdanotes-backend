const path = require('path');
const mongoose = require('mongoose');
const faker = require('faker');
const fs = require('fs');

const User = require('../models/User');
let env;

if (fs.existsSync(path.join(__dirname, '../../env'))) {
    env = require(path.join(__dirname, '../../env'));
  } else {
    env = process.env;
}

// if (process.env.NODE_ENV !== 'production') {
//     env = require(path.join(__dirname, '../../env'));
// } else {
//     env = process.env;
// }

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
