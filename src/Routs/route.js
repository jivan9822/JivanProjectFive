const router = require('express').Router();
const { uploadPhots } = require('../Utils/UploadPhoto');
const { userLogin, protect } = require('../MiddleWare/authController');
const user = require('../User/UserController');
const prod = require('../Product/ProductController');

// FIRST CREATING IMAGE URL AND THEN CREATING USER
router.post('/register', uploadPhots, user.createUser);

// LOGIN OF USER
router.post('/login', userLogin);

// FETCH USER DETAILS, UPDATE USER USING USER-ID
router
  .route('/:userId/profile')
  .get(protect, user.getUserProfile)
  .put(protect, uploadPhots, user.updateUserProfile);

router.post('/products', uploadPhots, prod.createProduct);

module.exports = router;
