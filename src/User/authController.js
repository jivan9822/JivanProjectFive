const AppError = require('../Error/AppError');
const { CatchAsync } = require('../Error/CatchAsync');
const User = require('./UserModel');
const jwt = require('jsonwebtoken');

// TOKEN GENERATION FUNCTION
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRETE_STRING, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

// USER LOGIN CONTROLLER
exports.userLogin = CatchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password); //

  // CHECK IF EMAIL AND PASSWORD IS NOT THERE
  if (!email || !password) {
    return next(
      new AppError(`Please provide email and password for login!`, 400)
    );
  }

  // CHECKING EMAIL AND PASS IN DATA BASE
  const user = await User.findOne({ email });
  if (!user || !(await user.correctPass(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // GENERATING TOKEN
  const token = generateToken(user._id);
  req.body.user = user;
  return res.status(200).json({
    status: true,
    message: 'User login successful',
    data: {
      userId: user._id,
      token,
    },
  });
});
