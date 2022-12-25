const AppError = require('../Error/AppError');
const { CatchAsync } = require('../Error/CatchAsync');
const Cart = require('../Models/cartModel');
const Order = require('../Models/orderModel');
const User = require('../Models/userModel');
const APIFeatures = require('../Utils/APIFeature');

exports.createUser = CatchAsync(async (req, res, next) => {
  req.body.profileImage = req.image;
  const user = await User.create(req.body);
  const cart = await Cart.create({ userId: user._id });
  const order = await Order.create({ userId: user._id });
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

exports.getAllUsers = CatchAsync(async (req, res, next) => {
  const feature = new APIFeatures(User.find(), req.query).filter();
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

exports.getSelfDetails = CatchAsync(async (req, res, next) => {
  res.status(200).json({
    status: true,
    data: {
      user: req.user,
    },
  });
});
