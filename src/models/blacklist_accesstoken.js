const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlacklistAccessTokenSchema = new Schema({
  access_token: { type: String, unique: true }
});

module.exports = mongoose.model('BlacklistAccessToken', BlacklistAccessTokenSchema);