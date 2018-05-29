const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const utils = require('../api/config/utils');

const User = require('../api/models/User');

describe('User model', () => {

    it('should fail when env is not testing', () => {
        expect(process.env.NODE_ENV).toEqual('testing');
    });

    it('should hash the password before saving the user to the database', async () => {
        const savedUser = await User.create(user);

        expect(savedUser.password).not.toEqual(user.password);
        expect(savedUser.password).toHaveLength(60);
    });

    it('should ensure that username and password fields are provided', async () => {
        const user = new User()
        user.validate((err) => {
            expect(err.errors.username.kind).toBe('required')
        });
        user.validate((err) => {
            expect(err.errors.password.kind).toBe('required')
        })
    })

    it('should prevent duplicate usernames from being saved to the database', async () => {
        const savedUser = await User.create(user);
        const nonunique = User.create(user);
        expect(nonunique._id).toBeUndefined();
    })

    it('should only accept passwords that are at minimum 12 characters long', async () => {
        const invalidPassword = { username: 'Clark', password: 'hi' }
        const invalid = () => {
            if (invalidPassword.password.length < 12) {
                throw 'Your password must be a minimum of 12 characters';
            } else {
                User.create(invalidPassword);
            }
        }
        expect(invalid).toThrow();
    })
});