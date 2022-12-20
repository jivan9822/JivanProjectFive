const { CatchAsync } = require('../Error/CatchAsync');
const User = require('./UserModel');

// CREATE NEW USER CONTROLLER
exports.createUser = CatchAsync(async (req, res, next) => {
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
