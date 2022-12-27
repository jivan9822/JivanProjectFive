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
            default: 0,
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
    },
    totalQuantity: {
      type: Number,
      default: 0,
    },
    totalItems: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
