const AppError = require('../Error/AppError');
const { CatchAsync } = require('../Error/CatchAsync');
const Cart = require('../Models/cartModel');
const Order = require('../Models/orderModel');
const APIFeatures = require('../Utils/APIFeature');

// FUNCTION TO MAKE CART EMPTY
const makeEmpty = (query) => {
  query.totalPrice = 0;
  query.totalQuantity = 0;
  query.totalItems = 0;
  query.items = [];
  return query;
};

// CRETE ORDER
exports.createOrder = CatchAsync(async (req, res, next) => {
  // GETTING DATA FROM CART TO CREATE ORDER
  const cart = await Cart.findById(req.user.cart);
  if (!cart.totalQuantity) {
    return next(
      new AppError('Cart is empty! Add product in cart to create order!', 400)
    );
  }

  // CREATING OBJ TO CREATE ORDER
  const Obj = { ...cart._doc };
  // REMOVING ID FROM OBJ
  delete Obj['_id'];

  // CREATING ORDER
  const order = await Order.create(Obj);
  // MAKING CART EMPTY
  await makeEmpty(cart).save();

  res.status(201).json({
    status: true,
    message: 'Order created success!',
    order,
  });
});

// GET ALL ORDERS WITH FILTER CANCELED PENDING PLACED
exports.getAllOrders = CatchAsync(async (req, res, next) => {
  const features = new APIFeatures(Order.find(), req.query)
    .filter()
    .limitFields()
    .page()
    .sort();

  const Orders = await features.query;
  if (!Order.length) {
    return next(new AppError(`No orders found!`, 404));
  }
  res.status(200).json({
    status: true,
    result: `${Orders.length} Orders found!`,
    data: {
      Orders,
    },
  });
});

// CANCEL A ORDER
exports.cancelOrder = CatchAsync(async (req, res, next) => {
  const { orderId } = req.body;
  const order = await Order.findOneAndUpdate(
    { _id: orderId, cancellable: true, status: { $ne: 'canceled' } },
    {
      $set: { status: 'canceled', cancellable: false },
    },
    {
      new: true,
    }
  );
  if (!order) {
    return next(new AppError(`No cancellable order found!`, 400));
  }
  res.status(200).json({
    status: true,
    message: 'Order canceled success!',
    order,
  });
});

// COMPLETE A ORDER
exports.placeOrder = CatchAsync(async (req, res, next) => {
  const { orderId } = req.body;
  const order = await Order.findOneAndUpdate(
    { _id: orderId, status: 'pending' },
    {
      $set: { status: 'completed' },
    },
    {
      new: true,
    }
  );
  if (!order) {
    return next(new AppError(`No order found with this id!`, 400));
  }
  res.status(200).json({
    status: true,
    message: 'Order Placed success!',
    data: {
      order,
    },
  });
});
