const router = require('express').Router();
const { uploadPhots } = require('../Utils/UploadPhoto');
const { userLogin, protect } = require('./authController');
const user = require('./UserController');

// REGISTRATION ROUTE OF NEW USER

// FIRST CREATING IMAGE URL AND THEN CREATING USER
router.post('/register', uploadPhots, user.createUser);

// LOGIN OF USER
router.post('/login', userLogin);

// FETCH USER DETAILS, UPDATE USER USING USER-ID
router
  .route('/:userId/profile')
  .get(protect, user.getUserProfile)
  .put(protect, uploadPhots, user.updateUserProfile);

module.exports = router;
