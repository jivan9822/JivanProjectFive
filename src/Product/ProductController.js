const { CatchAsync, isJsonString } = require('../Error/CatchAsync');
const AppError = require('../Error/AppError');
const Product = require('./ProductModel');
const APIFeature = require('../Utils/APIFeaturs');

exports.createProduct = CatchAsync(async (req, res, next) => {
  req.body.productImage = req.image;
  const product = await Product.create(req.body);
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

exports.getProductById = CatchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    return next(
      new AppError(`No product found with id: ${req.params.productId}`, 404)
    );
  }
  res.status(200).json({
    status: true,
    message: 'Success',
    data: {
      product,
    },
  });
});

exports.updateProductById = CatchAsync(async (req, res, next) => {
  req.body.productImage = req.image;
  const product = await Product.findByIdAndUpdate(
    { _id: req.params.productId },
    {
      $set: req.body,
    },
    { new: true, runValidators: true }
  );
  res.status(200).json({
    status: true,
    message: 'Success',
    data: {
      product,
    },
  });
});

exports.deleteProduct = CatchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(
    { _id: req.params.productId },
    {
      $set: { isDeleted: true, deletedAt: Date.now() },
    },
    { new: true, runValidators: true }
  );
  res.status(203).json({
    status: true,
    message: 'Success',
    data: {
      product,
    },
  });
});
