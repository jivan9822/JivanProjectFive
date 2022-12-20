const AppError = require('../Error/AppError');
const { CatchAsync } = require('../Error/CatchAsync');
const User = require('./UserModel');
const bcrypt = require('bcrypt');

// CREATE NEW USER CONTROLLER
exports.createUser = CatchAsync(async (req, res, next) => {
  // PARSING ADDRESS FIELD TO JSON OBJ
  req.body.address = req.body.address ? JSON.parse(req.body.address) : '';
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
  // IF BODY EMPTY RETURN WITH ERROR
  if (!Object.keys(req.body).length) {
    return next(new AppError(`Nothing to update! Body is empty`, 400));
  }

  // UPDATE
  const user = await User.findByIdAndUpdate(
    { _id: req.params.userId },
    {
      $set: req.body,
    },
    { new: true, runValidators: true }
  );

  // SPECIAL PASSWORD UPDATE
  user.password = await bcrypt.hash(req.body.password, 12);

  // SKIP VALIDATION ON PASSWORD
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: true,
    message: 'User profile updated',
    data: {
      user,
    },
  });
});
