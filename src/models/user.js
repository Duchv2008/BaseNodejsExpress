const mongoose = require('mongoose');
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const Schema = mongoose.Schema;
import Profile from 'models/profile.js';

const UserSchema = new Schema({
  username: { type: String, unique: true },
  password_digest: { type: String, unique: true },
  profile: { type: Profile.schema },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
}, {
  toObject: {
    versionKey: false,
    hide: '_id created_at updated_at password_digest',
    transform: (doc, ret, options) => {
      if (options.hide) {
        options.hide.split(' ').forEach(function (prop) {
          delete ret[prop];
        });
      }
      ret['id'] = doc.id;
      return ret;
    }
  }
});

//hashing a password before saving it to the database
UserSchema.pre('save', async function(next) {
  if (this.isNew == false) {
    next();
  }
  this.profile = new Profile();
  try {
    let hash = await bcrypt.hash(this.password_digest, 10)
    this.password_digest = hash;
    next();
  }
  catch(error) {
    next(err);
  }
});

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password_digest);
};

// JWT token
UserSchema.methods.generateJWTToken = function(refreshTokenKey) {
  let created_at = Date.now();
  var payload = {
    username: this.username,
    user_id: this._id,
    created_at: created_at,
    refreshTokenKey: refreshTokenKey,
  };
  var jwtToken = jwt.sign(payload, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRED_TIME,
  }); // miliseconds
  return jwtToken;
};

// Refresh token
UserSchema.methods.generateJWTRefreshToken = function(uniqKey) {
  let created_at = Date.now();
  var payload = { user_id: this.id, created_at: created_at, uniqKey: uniqKey };

  var jwtToken = jwt.sign(payload, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRED_TIME,
  });
  return jwtToken;
};
// expiresIn format: https://github.com/vercel/ms
module.exports = mongoose.model('User', UserSchema);