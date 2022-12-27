const mongoose = require('mongoose');
const orderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please enter userId'],
    },
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
    totalPrice: {
      type: Number,
      default: 0,
    },
    totalItems: {
      type: Number,
      default: 0,
    },
    totalQuantity: {
      type: Number,
      default: 0,
    },
    cancellable: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      default: 'pending',
      enum: {
        values: ['pending', 'completed', 'canceled'],
        message: 'status should be in "pending", "completed", "canceled"',
      },
    },
    deletedAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
  this.find({ isDeleted: false });
  next();
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
