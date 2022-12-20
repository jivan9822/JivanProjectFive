const { uploadPhots } = require('../Utils/UploadPhoto');
const prod = require('./ProductController');

const router = require('express').Router();

router.post('/products', uploadPhots, prod.createProduct);

module.exports = router;
