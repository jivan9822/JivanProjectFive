const router = require('express').Router();
const prod = require('../Controllers/productController');
const auth = require('../MiddleWare/authoriZation');
const { isJson } = require('../MiddleWare/isJsonMiddleWare');
const { uploadPhots } = require('../MiddleWare/uploadPhotos');

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

router
  .route('/:prodId')
  .get(auth.protect, prod.getProductById)
  .put(
    auth.protect,
    isJson('product'),
    uploadPhots,
    auth.restrictTo('admin'),
    prod.updateProduct
  )
  .delete(auth.protect, auth.restrictTo('admin'), prod.deleteProduct);

module.exports = router;
