const AppError = require('../Error/AppError');
const { CatchAsync } = require('../Error/CatchAsync');
const { updateOne } = require('../Models/cartModel');
const Cart = require('../Models/cartModel');
const Order = require('../Models/orderModel');
const User = require('../Models/userModel');
const APIFeatures = require('../Utils/APIFeature');

exports.createUser = CatchAsync(async (req, res, next) => {
  // RECEIVING PROFILE IMAGE URL FROM UPLOAD IMAGE MIDDLEWARE
  req.body.profileImage = req.image;

  // CREATING USER FROM REQ BODY
  const user = await User.create(req.body);

  // ONLY AFTER SUCCESSFUL USER CREATION WILL CREATE DEFAULT CART AND ORDER FOR USER
  const cart = await Cart.create({ userId: user._id });
  const order = await Order.create({ userId: user._id });

  // SETTING CART ID AND ORDER ID TO USER
  user.cart = cart._id;
  user.order = order._id;
  await user.save({ validateBeforeSave: false });
  res.status(201).json({
    status: true,
    message: 'User created success!',
    data: {
      user,
    },
  });
});

// AFTER SUCCESSFUL AUTHENTICATION WILL ALLOW USER TO LOIN
exports.userLogin = CatchAsync(async (req, res, next) => {
  res.status(200).json({
    status: true,
    message: 'Login success!',
    data: {
      token: req.token,
      user: req.user,
    },
  });
});

// GETTING ALL USER THIS IS ALLOW ONLY FOR ADMIN
exports.getAllUsers = CatchAsync(async (req, res, next) => {
  // THIS WILL HIDE ADMIN DATA TO DISPLAY
  req.query.roll = 'user';
  const feature = new APIFeatures(User.find(), req.query)
    .filter()
    .limitFields()
    .page()
    .sort();

  const users = await feature.query;
  if (!users.length) {
    return next(new AppError(`No user found!`, 404));
  }
  res.status(200).json({
    status: true,
    message: `${users.length} users found!`,
    data: {
      users,
    },
  });
});

// GET SELF USER DETAILS AFTER AUTHORIZATION ADMIN DON'T HAVE THIS ACCESS
exports.getSelfDetails = CatchAsync(async (req, res, next) => {
  res.status(200).json({
    status: true,
    data: {
      user: req.user,
    },
  });
});

// THIS IS ONLY FOR USER HE CAN UPDATE address fname lname email profileImage phone ONLY;
exports.updateUser = CatchAsync(async (req, res, next) => {
  req.body.profileImage = req.image;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: req.body,
    },
    { new: true, runValidators: true }
  );
  res.status(200).json({
    status: true,
    data: {
      user,
    },
  });
});

// DELETE USER ONLY ADMIN CAN PERFORM THIS OPERATION
exports.deleteUser = CatchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: { isDeleted: true, deletedAt: Date.now() },
    },
    { new: true }
  );
  if (!user) {
    return next(new AppError(`No user found with id: ${userId}`, 400));
  }
  res.status(204).json({
    status: true,
    data: null,
  });
});
