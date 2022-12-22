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
            required: [true, 'Please provide productId!'],
          },
          quantity: {
            type: Number,
            required: [true, 'Please enter a Qty!'],
            min: 1,
          },
        },
      ],
    },
    totalPrice: {
      type: Number,
      default: 0,
      // required: true,
      // comment: 'Holds total price of all the items in the cart',
    },
    totalItems: {
      type: Number,
      default: 1,
      // required: true,
      // comment: 'Holds total number of items in the cart',
    },
  },
  { timestamps: true }
);

cartSchema.index({ userId: 1 });

// cartSchema.pre('save', async function (next) {
//   console.log(this.items.length);
//   console.log(this);
//   this.totalItems = this.items.length;
//   next();
// });

// cartSchema.statics.calculateItemPrice = async function (items) {
//   const stats = await this.aggregate([
//     {
//       $match: { items: items },
//     },
//   ]);
// };

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;

/**
 * {
  userId: { ObjectId, refs to User, mandatory, unique },
  items:
    [
      {
        productId: { ObjectId, refs to Product model, mandatory },
        quantity: { number, mandatory, min 1 },
      },
    ],
  totalPrice:
    {
      number,
      mandatory,
      comment: 'Holds total price of all the items in the cart',
    },
  totalItems:
    { number, mandatory, comment: 'Holds total number of items in the cart' },
  createdAt: { timestamp },
  updatedAt: { timestamp },
}
 */
