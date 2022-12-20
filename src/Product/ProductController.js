const { CatchAsync } = require('../Error/CatchAsync');
const AppError = require('../Error/AppError');
const Product = require('./ProductModel');

exports.createProduct = CatchAsync(async (req, res, next) => {
  req.body.product = req.body.product ? JSON.parse(req.body.product) : null;
  if (!req.body.product) {
    return next(
      new AppError(
        `Body is empty! Please provide products details in body.`,
        400
      )
    );
  }
  req.body.product.productImage = req.image;
  const product = await Product.create(req.body.product);
  res.status(201).json({
    status: true,
    message: 'Success',
    data: {
      product,
    },
  });
});
