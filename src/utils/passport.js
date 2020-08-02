import passport from 'passport';
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy, 
  ExtractJwt = require('passport-jwt').ExtractJwt;
import User from 'models/user';
import BlackList from 'models/blacklist_accesstoken.js';

const localAuthenticate = new LocalStrategy({
  usernameField: 'username', // Custom field from request. Can use email or phone ...
  passwordField: 'password'
}, function (username, password, done) {
  return User.findOne({ username: username })
    .then(user => {
      console.log(`Login success: ${JSON.stringify(user)}`);
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user, { message: 'Logged In Successfully' });
    })
    .catch(err => {
      console.log(`Login catch error ${err}`);
      return done(err, false, { message: 'Logged In Fail' });
    });
});

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromHeader('authorization');
opts.secretOrKey = 'StreamingServer Duchv';
opts.passReqToCallback = true;

const jwtAuthenticate = new JwtStrategy(opts, function (req, jwt_payload, done) {
  User.findOne({ _id: jwt_payload.user_id }, function (err, user) {
    if (err) {
      return done(err, false);
    }

    if (!user) {
      return done(null, false);
    }

    /// Nếu access_token có trong blacklist tức là đã logout
    let jwt_token = req.headers['authorization'];
    BlackList.exists({ access_token: jwt_token }).then(exist => {
      console.log(JSON.stringify(exist));
      if (exist) {
        return done(null, false);
      }
      return done(null, user);
    }, e => {
      return done(null, false);
    });
  });
});

passport.use(localAuthenticate);
passport.use(jwtAuthenticate);
