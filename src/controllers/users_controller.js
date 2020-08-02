import passport from 'passport';
var randtoken = require('rand-token');
import User from 'models/user';

const create = async (req, res) => {
  let { username, password } = req.body;

  try {
    let user = new User({
      username: username,
      password_digest: password
    });
    await user.save();
  }
  catch (error) {
    return res.status(400).send('Register fail');
  }
  // session false để không lưu lại session trên server.
  passport.authenticate('local', { session: false }, (err, user, info) => {
    console.log(`Login : ${JSON.stringify(user)} with err: ${err}`);
    if (err || !user) {
      return res.send('Register success');
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      var hash_token = randtoken.generate(16);
      const token = user.generateJWTToken(hash_token);
      const refreshToken = user.generateJWTRefreshToken(hash_token);
      return res.json({
        'user_id': user._id,
        'access_token': token,
        'refresh_token': refreshToken
      });
    });
  })(req, res);
};

export default {
  create
};