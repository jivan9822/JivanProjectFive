const { CatchAsync } = require('../Error/CatchAsync');
const Product = require('./ProductModel');

exports.createProduct = CatchAsync(async (req, res, next) => {
  req.body.product = req.body.product ? JSON.parse(req.body.product) : null;
  req.body.product.productImage = req.image;
  const product = await Product.create(req.body.product);
  for (const i of req.body.availableSizes) {
    product.availableSizes.push(i);
  }
  await product.save();
  res.send(product);
});
