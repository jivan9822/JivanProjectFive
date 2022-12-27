const AppError = require('../Error/AppError');
const { CatchAsync } = require('../Error/CatchAsync');
const Product = require('../Models/productModel');
const APIFeatures = require('../Utils/APIFeature');

exports.createProduct = CatchAsync(async (req, res, next) => {
  req.body.productImage = req.image;
  const product = await Product.create(req.body);
  res.status(201).json({
    status: true,
    message: 'Product created success!',
    product,
  });
});

exports.getAllProduct = CatchAsync(async (req, res, next) => {
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .limitFields()
    .page()
    .sort();
  const products = await features.query;
  if (!products.length) {
    return next(new AppError(`No products found!`, 404));
  }
  // const products = await Product.aggregate([
  //   {
  //     $group: {
  //       _id: '$brand',
  //       totalProduct: { $sum: 1 },
  //       maxPrice: { $max: '$price' },
  //       minPrice: { $min: '$price' },
  //       avgPrice: { $avg: '$price' },
  //     },
  //   },
  // ]);
  res.status(200).json({
    status: true,
    result: `${products.length} products found!`,
    products,
  });
});

exports.getProductById = CatchAsync(async (req, res, next) => {
  const feature = new APIFeatures(
    Product.findById(req.params.prodId),
    req.query
  ).limitFields();
  const product = await feature.query;
  res.status(200).json({
    status: true,
    product,
  });
});

exports.updateProduct = CatchAsync(async (req, res, next) => {
  req.body.productImage = req.image;
  const product = await Product.findByIdAndUpdate(
    req.params.prodId,
    { $set: req.body },
    { new: true, runValidators: true }
  );
  if (!product) {
    return next(`No product found with id: ${req.params.prodId}`, 400);
  }
  res.status(200).json({
    status: true,
    message: 'Product Update Success!',
    data: {
      product,
    },
  });
});

exports.deleteProduct = CatchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(
    req.params.prodId,
    {
      $set: { isDeleted: true, deletedAt: Date.now() },
    },
    { new: true }
  );
  if (!product) {
    return next(`No product found with id: ${req.params.prodId}`, 400);
  }
  res.status(204).json({
    status: true,
    data: null,
  });
});
