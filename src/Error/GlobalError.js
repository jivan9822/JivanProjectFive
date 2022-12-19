exports.globalErrorHand = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    err = validErrHandler(err);
  }
  if (err.code === 11000) {
    err = duplicateError(err);
  }
  res.status(err.statusCode || 500).json({
    status: false,
    msg: err.message,
    err,
  });
};

const validErrHandler = (error) => {
  error.statusCode = 400;
  return error;
};

const duplicateError = (error) => {
  error.statusCode = 409;
  const msg = Object.keys(error.keyValue);
  error.message = `The ${msg}: ${error.keyValue[msg]} is already in use!`;
  return error;
};
