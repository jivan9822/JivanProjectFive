const AppError = require('../Error/AppError');
const { CatchAsync, isJsonString } = require('../Error/CatchAsync');
const User = require('./UserModel');
const bcrypt = require('bcrypt');

// CREATE NEW USER CONTROLLER
exports.createUser = CatchAsync(async (req, res, next) => {
  req.body.profileImage = req.image;
  const user = await User.create(req.body);
  res.status(201).json({
    status: true,
    message: 'User created successfully',
    data: {
      user,
    },
  });
});

// USER LOGIN IS IN AUTH-CONTROLLER

// GET USER PROFILE /:userId/profile
exports.getUserProfile = CatchAsync(async (req, res, next) => {
  res.status(200).json({
    status: true,
    message: 'User profile details',
    data: req.user,
  });
});

// UPDATE USER PROFILE /:userId/profile
exports.updateUserProfile = CatchAsync(async (req, res, next) => {
  // UPDATE
  req.body.profileImage = req.image;
  const user = await User.findByIdAndUpdate(
    { _id: req.params.userId },
    {
      $set: req.body,
    },
    { new: true, runValidators: true }
  );

  const newPass = await bcrypt.hash(user.password, 12);
  const newUser = await User.findByIdAndUpdate(
    { _id: req.params.userId },
    {
      $set: { password: newPass },
    },
    { new: true }
  );

  res.status(200).json({
    status: true,
    message: 'User profile updated',
    data: {
      newUser,
    },
  });
});
