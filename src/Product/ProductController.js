const { CatchAsync } = require('../Error/CatchAsync');
const AppError = require('../Error/AppError');
const Product = require('./ProductModel');
const APIFeature = require('../Utils/APIFeaturs');

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

exports.getProductDetails = CatchAsync(async (req, res, next) => {
  // FILTER SORT FIELDS LIMIT PAGINATION
  const features = new APIFeature(Product.find(), req.query)
    .filter()
    .sort()
    .fields()
    .pagination();

  // AFTER ALL QUERY GETTING FINAL PRODUCTS
  const products = await features.query;

  // IF NO DATA FOUND THEN SIMPLY RETURN NOT FOUND ERROR
  if (!products.length) {
    return next(new AppError(`No products found!`, 404));
  }
  res.status(200).json({
    status: true,
    message: 'Success',
    result: `${products.length} Products found!`,
    data: {
      products,
    },
  });
});
