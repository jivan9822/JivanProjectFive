const router = require('express').Router();
const order = require('../Controllers/orderController');
const auth = require('../MiddleWare/authoriZation');

// ORDER / CREATE / GET ALL / CANCEL / PLACE
router
  .route('/')
  .get(auth.protect, auth.restrictTo('user'), order.getAllOrders)
  .post(auth.protect, auth.restrictTo('user'), order.createOrder)
  .put(auth.protect, auth.restrictTo('user'), order.cancelOrder)
  .patch(auth.protect, auth.restrictTo('user'), order.placeOrder);

module.exports = router;
