const AppError = require('../Error/AppError');

exports.isJson = (data) => {
  return (req, res, next) => {
    try {
      req.body = JSON.parse(req.body[data]);
    } catch (error) {
      return next(new AppError(`Please provide a valid json data`, 400));
    }
    next();
  };
};
