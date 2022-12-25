const mongoose = require('mongoose');

const cartSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide userId!'],
      unique: true,
    },
    items: {
      type: [
        {
          productId: {
            type: mongoose.Types.ObjectId,
            ref: 'Product',
          },
          quantity: {
            type: Number,
          },
          price: {
            type: Number,
          },
        },
      ],
    },
    totalPrice: {
      type: Number,
      default: 0,
      // comment: 'Holds total price of all the items in the cart',
    },
    totalQuantity: {
      type: Number,
      default: 0,
    },
    totalItems: {
      type: Number,
      default: 0,
      // comment: 'Holds total number of items in the cart',
    },
  },
  { timestamps: true }
);

cartSchema.index({ userId: 1 });

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
