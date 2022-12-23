const Cart = require('../Cart/cartModel');
const AppError = require('../Error/AppError');
const { CatchAsync } = require('../Error/CatchAsync');
const Order = require('./OrderModel');

// ### POST /users/:userId/orders
exports.createOrder = CatchAsync(async (req, res, next) => {
  const { cartId } = req.body;
  if (!cartId) {
    return next(new AppError(`Please send your cart id!`, 400));
  }
  const cart = await Cart.findById(cartId);
  if (!cart || !cart.totalItems) {
    return next(
      new AppError(`${!cart ? 'cart not found!' : ' Your cart is empty!'}`, 400)
    );
  }
  const Obj = JSON.parse(JSON.stringify(cart));
  cart.items = [];
  cart.totalItems = 0;
  cart.totalPrice = 0;
  cart.totalQuantity = 0;
  await cart.save();
  [('_id', 'createdAt', 'updatedAt', '__v')].map((el) => delete Obj[el]);
  const order = await Order.create(Obj);
  res.status(201).json({
    status: true,
    message: 'Success',
    data: {
      order,
    },
  });
});
