import passport from 'passport';
var randtoken = require('rand-token');
import jwt from 'jsonwebtoken';
import User from 'models/user';
import BlackList from 'models/blacklist_accesstoken';

const create = (req, res) => {
  // session false để không lưu lại session trên server.
  passport.authenticate('local', { session: false }, (err, user, info) => {
    console.log(`Login : ${JSON.stringify(user)} with err: ${err}`);
    if (err || !user) {
      return res.status(400).json({
        message: 'Login fail'
      });
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

const refreshToken = (req, res) => {
  let refresh_token = req.body.refresh_token;

  if (!(req.headers)) {
    return res.status(403).json({
      error: 'Refresh token fail',
    });
  }

  jwt.verify(refresh_token, process.env.REFRESH_TOKEN_PRIVATE_KEY, function (err, payload) {
    let jwtToken = req.headers['authorization'];
    let payloadAccessToken = jwt.decode(jwtToken, { complete: true }).payload;

    console.log(JSON.stringify(payloadAccessToken));

    if (err || !jwtToken) {
      return res.status(403).json({
        error: 'Refresh token is expired',
      });
    }
    let userId = payload.user_id;
    let isUser = payloadAccessToken.user_id == payload.user_id && payload.uniqKey == payloadAccessToken.refreshTokenKey;
    console.log(isUser);
    if (!isUser) {
      return res.status(403).json({
        error: 'Refresh token fail',
      });
    }

    User.findById(userId)
      .then(user => {
        var hash_token = randtoken.generate(16);
        res.json({
          user_id: userId,
          access_token: user.generateJWTToken(hash_token),
          refresh_token: user.generateJWTRefreshToken(hash_token),
        });
      }, err => {
        res.status(403).json({
          error: 'Refresh token fail',
        });
      });
  });
};

const destroy = (req, res) => {
  let access_token = req.headers['authorization'];

  let blackList = new BlackList({
    access_token: access_token
  });

  blackList.save(function(error, post) {
    if (error) {
      return res.status(400).send('Logout fail');
    }
    res.send('Logout success');
  });
};

export default {
  create,
  refreshToken,
  destroy
};