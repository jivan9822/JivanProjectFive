const AppError = require('../Error/AppError');

const duplicateErrHandler = (err) => {
  const msg = err.message.match(/{.*?}/);
  return new AppError(`Duplicate not allowed! ${msg[0]}`, 409);
};

const validationError = (err) => new AppError(`${err.message}`, 400);

exports.globalErrorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') err = validationError(err);

  if (err.code === 11000) err = duplicateErrHandler(err);

  res.status(err.statusCode || 500).json({
    status: false,
    message: err.message,
    err,
  });
};
