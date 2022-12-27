const router = require('express').Router();
const user = require('../Controllers/userController');
const auth = require('../MiddleWare/authoriZation');
const { uploadPhots } = require('../MiddleWare/uploadPhotos');
const { isJson } = require('../MiddleWare/isJsonMiddleWare');

// USER REGISTER  / GET ALL  / UPDATE
router
  .route('/')
  .post(isJson('user'), uploadPhots, user.createUser)
  .get(auth.protect, auth.restrictTo('admin'), user.getAllUsers)
  .put(
    auth.protect,
    auth.restrictTo('user'),
    isJson('user'),
    auth.updateOnly('user'),
    uploadPhots,
    user.updateUser
  );

// USER LOGIN
router.post('/login', auth.authentication, user.userLogin);

// USER GET ONE
router.get('/self', auth.protect, auth.restrictTo('user'), user.getSelfDetails);

// USER DELETE
router
  .route('/:userId')
  .delete(auth.protect, auth.restrictTo('admin'), user.deleteUser);

module.exports = router;
