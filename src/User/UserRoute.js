const router = require('express').Router();
const { uploadPhots } = require('../Utils/UploadPhoto');
const { userLogin } = require('./authController');
const { createUser } = require('./UserController');

// REGISTRATION ROUTE OF NEW USER

// FIRST CREATING IMAGE URL AND THEN CREATING USER
router.post('/register', uploadPhots, createUser);

// LOGIN OF USER
router.post('/login', userLogin);

module.exports = router;
