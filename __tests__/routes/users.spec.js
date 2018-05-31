const mongoose = require('mongoose');
const request = require('supertest');
const faker = require('faker');
const path = require('path');

const User = require('../../api/models/User');
const server = require('../../server')
const { userName, password } = faker.internet;

let userData = {
    username: userName(),
    password: password()
}
let testToken;
let env;

if (
  process.env.NODE_ENV !== 'production' &&
  process.env.NODE_ENV !== 'testing'
) {
  env = require(path.join(__dirname, '../../env'));
} else {
  env = process.env;
}

describe('User API', () => {
    beforeAll(() => {
        return mongoose.connect(env.DATABASE_URL).then(() => User.remove({}));
    });

    afterAll(() => {
        return User.remove()
        .then(() => mongoose.disconnect())
    });

    it('should fail when env is not testing', () => {
      expect(process.env.NODE_ENV).toEqual('testing');
    });

    // Register a new user
    describe('[POST] /api/v1/register', () => {
        it('should create a user and return the user (id & username) with a JWT', async () => {
            const response = await request(server).post('/api/v1/register').send(userData).set('Accept', 'application/json');
            const { status, type, body } = response;
            const { user, token } = body;

            const usernameInUser = 'username' in user;
            const passwordInUser = 'password' in user;            
            const _idInUser = '_id' in user;
            const hasToken = 'token' in body && token !== '';
            testToken = token;
            
            expect(status).toEqual(201);
            expect(type).toEqual('application/json');
            expect(usernameInUser).toBe(true);
            expect(_idInUser).toBe(true);
            expect(hasToken).toBe(true);
        });
    })

    describe('[POST] /api/v1/login', () => {
        it('should verify an existing user and return the user doc (id & username) with a JWT', async () => {
            const response = await request(server).post('/api/v1/login').send(userData).set('Accept', 'application/json');
            const { status, type, body } = response;
            const { user, token } = body;

            const usernameInUser = 'username' in user;
            const _idInUser = '_id' in user;
            const hasToken = 'token' in body && token !== '';
            testToken = token;
            
            expect(status).toEqual(200);
            expect(type).toEqual('application/json');
            expect(usernameInUser).toBe(true);
            expect(_idInUser).toBe(true);
            expect(hasToken).toBe(true);
        });

    });

    describe('[GET] /api/v1/users', () => {
        it('should retrieve a list of all users if the authorization token is valid', async () => {
            const response = await request(server).get('/api/v1/users').set('Authorization', `Bearer ${testToken}`);
            const { status, type, body } = response;
            
            expect(status).toEqual(200);
            expect(type).toEqual('application/json');
        });

    })

    describe('[GET] /api/v1/logout', () => {
        it('should logout a user', async () => {
            const response = await request(server).get('/api/v1/logout');
            const { status } = response;
            testToken = undefined;
            
            expect(status).toEqual(200);
        });
    });
});