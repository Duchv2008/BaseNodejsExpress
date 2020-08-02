import Profile from 'models/profile.js';
import User from 'models/user.js';

const show = async (req, res) => {
  let user_id = req.params.user_id;
  if (!user_id) {
    return res.status(400).send('User not exist');
  }

  let userProfile = await User.findById(user_id);
  if (!userProfile) {
    return res.status(400).send('User not exist');
  }
  return res.send(userProfile.toObject());
};

const update = async (req, res) => {
  let { name, birth_day, bio } = req.body;
  let current_user = req.user;
  // TODO
};

export default {
  update,
  show
};