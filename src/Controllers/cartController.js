const AppError = require('../Error/AppError');
const { CatchAsync } = require('../Error/CatchAsync');
const Cart = require('../Models/cartModel');
const Product = require('../Models/productModel');

// ADD TO CART

exports.addToCart = CatchAsync(async (req, res, next) => {
  // PRODUCT TO ADD IN CART FROM REQ BODY
  const productId = req.body.productId;

  // GETTING USER CART FROM USER ID
  const cart = await Cart.findById(req.user.cart);

  // GETTING PRODUCT DETAILS
  const product = await Product.findById(productId);

  // IF PRODUCT NOT FOUND
  if (!product) {
    return next(new AppError(`Product with id: ${productId} not found!`, 400));
  }
  // EXTRACTING PRICE OF PRODUCT
  const price = product.price;

  // CHECKING IF PRODUCT ALREADY PRESENT
  const ind = cart.items.findIndex((p) => p.productId == productId);

  // IF PRODUCT ALREADY IN CART THEN INCREMENT QTY ONLY
  if (cart && ind !== -1) {
    cart.items[ind].quantity++;
  } else {
    // ELSE WILL ADD PRODUCT IN CART
    cart.items.push({ productId, price, quantity: 1 });
  }

  // UPDATE OF ALL OTHER FIELD
  cart.totalPrice += price;
  cart.totalQuantity++;
  cart.totalItems = cart.items.length;
  // FINALLY SAVING TO DATA BASE
  await cart.save();
  res.status(201).json({
    status: true,
    message: 'Added to cart success!',
    data: {
      cart,
    },
  });
});

exports.updateCart = CatchAsync(async (req, res, next) => {
  const cart = await Cart.findByIdAndUpdate(req.user.cart);
  const { productId } = req.body;
  const key = req.body.removeProduct;
  const ind = cart.items.findIndex((p) => p.productId == productId);
  if (ind === -1) {
    return next(new AppError(`Product not found with id:${productId}`, 400));
  }
  if (key === 0 || cart.items[ind].quantity === 1) {
    cart.totalPrice -= cart.items[ind].price * cart.items[ind].quantity;
    cart.totalQuantity -= cart.items[ind].quantity;
    cart.items.splice(ind, 1);
  } else {
    cart.totalPrice -= cart.items[ind].price;
    cart.totalQuantity--;
    cart.items[ind].quantity--;
  }
  cart.totalItems = cart.items.length;
  await cart.save();
  res.status(200).json({
    status: true,
    message: 'Update success!',
    data: {
      cart,
    },
  });
});

exports.getCart = CatchAsync(async (req, res, next) => {
  const cart = await Cart.findById(req.user.cart).populate('items.productId');
  res.status(200).json({
    status: true,
    data: {
      cart,
    },
  });
});

exports.deleteCart = CatchAsync(async (req, res, next) => {
  const cart = await Cart.findByIdAndUpdate(req.user.cart, {
    $set: { totalPrice: 0, totalQuantity: 0, totalItems: 0, items: [] },
  });
  res.status(204).json({
    status: true,
    data: null,
  });
});
