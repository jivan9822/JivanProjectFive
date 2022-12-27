const router = require('express').Router();
const prod = require('../Controllers/productController');
const auth = require('../MiddleWare/authoriZation');
const { isJson } = require('../MiddleWare/isJsonMiddleWare');
const { uploadPhots } = require('../MiddleWare/uploadPhotos');

// PRODUCT CREATE / GET ALL
router
  .route('/')
  .post(
    auth.protect,
    isJson('product'),
    uploadPhots,
    auth.restrictTo('admin'),
    prod.createProduct
  )
  .get(auth.protect, prod.getAllProduct);

// PRODUCT GET ONE / UPDATE / DELETE
router
  .route('/:prodId')
  .get(auth.protect, prod.getProductById)
  .put(
    auth.protect,
    auth.restrictTo('admin'),
    isJson('product'),
    auth.updateOnly('product'),
    uploadPhots,
    prod.updateProduct
  )
  .delete(auth.protect, auth.restrictTo('admin'), prod.deleteProduct);

module.exports = router;
