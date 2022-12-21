const router = require('express').Router();
const { uploadPhots } = require('../Utils/UploadPhoto');
const { userLogin, protect } = require('../MiddleWare/authController');
const user = require('../User/UserController');
const prod = require('../Product/ProductController');
const { isJsonString } = require('../Error/CatchAsync');

//! USER ROUTE
// FIRST CREATING IMAGE URL AND THEN CREATING USER
router.post('/register', isJsonString('user'), uploadPhots, user.createUser);

// LOGIN OF USER
router.post('/login', userLogin);

// FETCH USER DETAILS, UPDATE USER USING USER-ID
router
  .route('/:userId/profile')
  .get(protect, user.getUserProfile)
  .put(protect, isJsonString('user'), uploadPhots, user.updateUserProfile);

//! PRODUCE ROUTE
router
  .route('/products')
  .post(isJsonString('product'), uploadPhots, prod.createProduct)
  .get(prod.getProductDetails);

router
  .route('/products/:productId')
  .get(prod.getProductById)
  .put(isJsonString('product'), uploadPhots, prod.updateProductById)
  .delete(prod.deleteProduct);

module.exports = router;
