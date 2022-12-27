const router = require('express').Router();
const auth = require('../MiddleWare/authoriZation');
const cart = require('../Controllers/cartController');

router
  .route('/')
  .post(auth.protect, cart.addToCart)
  .put(auth.protect, cart.updateCart)
  .delete(auth.protect, cart.deleteCart)
  .get(auth.protect, cart.getCart);

module.exports = router;
