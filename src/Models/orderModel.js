const mongoose = require('mongoose');
const orderSchema = mongoose.Schema(
  {
    //   userId: {ObjectId, refs to User, mandatory},
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please enter userId'],
    },
    //   items: [{
    //     productId: {ObjectId, refs to Product model, mandatory},
    //     quantity: {number, mandatory, min 1}
    //   }],
    items: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          default: 0,
        },
      },
    ],
    //   totalPrice: {number, mandatory, comment: "Holds total price of all the items in the cart"},
    totalPrice: {
      type: Number,
      default: 0,
    },
    //   totalItems: {number, mandatory, comment: "Holds total number of items in the cart"},
    totalItems: {
      type: Number,
      default: 0,
    },
    //   totalQuantity: {number, mandatory, comment: "Holds total number of quantity in the cart"},
    totalQuantity: {
      type: Number,
      default: 0,
    },
    //   cancellable: {boolean, default: true},
    cancellable: {
      type: Boolean,
      default: true,
    },
    //   status: {string, default: 'pending', enum[pending, completed, cancled]},
    status: {
      type: String,
      default: 'pending',
      enum: {
        values: ['pending', 'completed', 'canceled'],
        message: 'status should be in "pending", "completed", "canceled"',
      },
    },
    //   deletedAt: {Date, when the document is deleted},
    deletedAt: {
      type: Date,
    },
    //   isDeleted: {boolean, default: false},
    isDeleted: {
      type: Boolean,
      default: false,
    },
    //   createdAt: {timestamp},
    //   updatedAt: {timestamp},
  },
  { timestamps: true }
);
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
