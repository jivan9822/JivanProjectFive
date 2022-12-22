const { CatchAsync } = require('../Error/CatchAsync');
const Cart = require('./cartModel');
const Product = require('../Product/ProductModel');
const AppError = require('../Error/AppError');

exports.createCart = CatchAsync(async (req, res, next) => {
  const { userId, productId } = req.body;
  if (userId !== req.params.userId) {
    return next(new AppError(`UserId in params and body mismatch!`, 400));
  }
  if (!userId || !productId) {
    return next(new AppError(`UserId or and ProductId is missing!`, 400));
  }
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError(`Product not found!`, 404));
  }
  const userCart = await Cart.findOne({ userId });
  req.body.totalPrice = product.price;
  req.body.items = { productId, quantity: 1 };
  if (!userCart) {
    const newCart = await Cart.create(req.body);
    return res.status(201).json({
      status: true,
      message: 'Success',
      data: {
        newCart,
      },
    });
  }
  const ind = userCart.items.findIndex((p) => p.productId == productId);
  if (ind > -1) {
    userCart.items[ind].quantity++;
  } else {
    userCart.items.push(req.body.items);
    userCart.totalItems++;
  }
  userCart.totalPrice += product.price;
  await userCart.save();
  res.status(201).json({
    status: true,
    message: 'Success',
    data: {
      userCart,
    },
  });
});

exports.updateCartById = CatchAsync(async (req, res, next) => {
  const { cartId, removeProduct, productId } = req.body;
  const cart = await Cart.findById(cartId);
  if (!cart) {
    return next(new AppError(`The cart with this id dose not exist!`, 400));
  }
  const ind = cart.items.findIndex((p) => p.productId == productId);
  if (ind === -1) {
    return next(
      new AppError(
        `This Product is not in your cart!, Please provide valid productId`,
        400
      )
    );
  }
  if (removeProduct === 0 || cart.items[ind].quantity === 1) {
    cart.items.splice(ind, 1);
  } else {
    cart.items[ind].quantity--;
  }
  await cart.save();
  res.status(201).json({
    status: true,
    message: 'Success',
    data: {
      cart,
    },
  });
});

exports.getCartById = CatchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ userId: req.params.userId }).populate(
    'items.productId'
  );
  //   const cart = await Cart.find().populate('items.productId');
  res.send(cart);
});
