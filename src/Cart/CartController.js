const { CatchAsync } = require('../Error/CatchAsync');
const Cart = require('./cartModel');
const Product = require('../Product/ProductModel');
const AppError = require('../Error/AppError');
const { emptyCart, updateUtil, addToCart } = require('../Utils/SmallUtils');

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
  req.body.items = { productId, quantity: 1, price: product.price };
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
  const newCart = await addToCart(query, ind, req.body.items).save();
  res.status(201).json({
    status: true,
    message: 'Success',
    data: {
      newCart,
    },
  });
});

exports.updateCartById = CatchAsync(async (req, res, next) => {
  const { cartId, removeProduct, productId } = req.body;
  const cart = await Cart.findOne({ userId: req.user._id }).select(
    '+items.price'
  );
  if (cart._id != cartId) {
    return next(new AppError(`CartId in body is not correct!`, 400));
  }
  if (!cart) {
    return next(new AppError(`The cart with this id dose not exist!`, 404));
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
  const cartNew = await updateUtil(removeProduct, cart, ind).save();

  res.status(200).json({
    status: true,
    message: 'Success',
    data: {
      cartNew,
    },
  });
});

exports.getCartById = CatchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ userId: req.params.userId }).populate(
    'items.productId'
  );
  if (req.params.userId !== req.body.userId) {
    return next(new AppError(`UserId mismatch in params and body!`, 400));
  }
  if (!cart) {
    return next(new AppError(`Cart dose not found for this user!`, 404));
  }
  res.status(200).json({
    status: true,
    message: 'Success',
    data: {
      cart,
    },
  });
});

exports.deleteCartById = CatchAsync(async (req, res, next) => {
  const query = Cart.find();
  const cart = await emptyCart(query, req.params.userId);
  if (!cart) {
    return next(new AppError(`No cart present with this id!`, 404));
  }
  res.status(204).json({
    data: null,
  });
});
