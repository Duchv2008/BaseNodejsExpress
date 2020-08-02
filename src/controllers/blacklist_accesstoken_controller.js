import passport from 'passport';
var randtoken = require('rand-token');

const create = (req, res) => {
  console.log(req.headers);
  res.send({
    'msg': 'Blacklist access token'
  });
};

export default {
  create,
};