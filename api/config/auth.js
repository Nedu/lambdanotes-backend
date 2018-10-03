const jwt = require('jsonwebtoken');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const path = require('path');
const fs = require('fs');
let env;

if (fs.existsSync(path.join(__dirname, '../../env'))) {
  env = require(path.join(__dirname, '../../env'));
} else {
  env = process.env;
}

// if (process.env.NODE_ENV !== 'production') {
//   env = require(path.join(__dirname, '../../env'));
// } else {
//   env = process.env;
// }

const User = require('../models/User');
const secret = env.SECRET;

// Passport strategy for authenticating with a username and password
const localStrategy = new LocalStrategy(function(username, password, done) {
  User.findOne({ username })
    .then(user => {
      if (!user) {
        done(null, false);
      } else {
        user
          .validatePassword(password)
          .then(isValid => {
            if (isValid) {
              const { _id, username } = user;
              return done(null, { _id, username });
            } else {
              return done(null, false);
            }
          })
          .catch(err => {
            return done(err);
          });
      }
    })
    .catch(err => done(err));
});

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret,
};

// A passport strategy for securing RESTful endpoinds using JWT
const jwtStrategy = new JwtStrategy(jwtOptions, function(payload, done) {
  User.findById(payload.sub)
    .select('-password')
    .then(user => {
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    })
    .catch(err => {
      done(err, false);
    });
});

// passport global middleware
passport.use(localStrategy);
passport.use(jwtStrategy);

// passport local middleware
const passportOptions = { session: false };
const authenticate = passport.authenticate('local', passportOptions);
const restricted = passport.authenticate('jwt', passportOptions);

function makeToken(user) {
  const timestamp = new Date().getTime();
  const payload = {
    sub: user._id,
    iat: timestamp,
    username: user.username,
  };
  const options = {
    expiresIn: '24h',
  };

  return jwt.sign(payload, secret, options);
}

module.exports = { authenticate, restricted, makeToken}