const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  name: { type: String },
  birth_day: { type: Date },
  bio: { type: String, default: ""},
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
    hide: '_id __v created_at updated_at',
    transform: (doc, ret, options) => {
      if (options.hide) {
        options.hide.split(' ').forEach(function (prop) {
          delete ret[prop];
        });
      }
    }
  }
});

module.exports = mongoose.model('Profile', ProfileSchema);
