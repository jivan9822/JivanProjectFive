const router = require('express').Router();
const { uploadPhots } = require('../Utils/UploadPhoto');
const { createUser } = require('./UserController');

// REGISTRATION ROUTE OF NEW USER

// FIRST CREATING IMAGE URL AND THEN CREATING USER
router.post('/register', uploadPhots, createUser);

module.exports = router;
