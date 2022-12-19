const router = require('express').Router();
const { uploadPhots } = require('../Utils/UploadPhoto');
const { createUser } = require('./UserController');

router.post('/register', uploadPhots, createUser);

module.exports = router;
