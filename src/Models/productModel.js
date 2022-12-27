const mongoose = require('mongoose');
const npmValidate = require('validator');

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title of product!'],
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide description of product!'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide price of product!'],
      validate: {
        validator: (el) => el >= 0,
        message: 'Price should be greater than zero!',
      },
    },
    brand: String,
    currencyId: {
      type: String,
      required: [true, 'Please provide currency id!'],
      default: 'INR',
      enum: {
        values: ['INR', 'USD'],
        message: 'Only INR and USD is supported!',
      },
    },
    currencyFormat: {
      type: String,
      required: [true, 'Please provide currencyFormat!'],
      default: '₹',
      enum: {
        values: ['₹', '$'],
        message: 'Only ₹ and $ is supported!',
      },
    },
    isFreeShipping: {
      type: Boolean,
      default: false,
    },
    productImage: {
      type: String,
      required: [true, 'Please provide image of product!'],
    },
    style: String,
    availableSizes: {
      type: [
        {
          type: String,
          enum: {
            values: ['S', 'XS', 'M', 'X', 'L', 'XXL', 'XL'],
            message: `Please provide from 'S', 'XS', 'M', 'X', 'L', 'XXL', 'XL'`,
          },
        },
      ],
      required: [true, 'Please provide availableSizes of product!'],
    },
    installments: Number,
    deletedAt: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    reviewAvg: {
      type: Number,
      default: 0,
    },
    review: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'productId',
  localField: '_id',
});

productSchema.pre('save', function (next) {
  if (this.installments) {
    this.installments = this.installments.toFixed(0);
  }
  this.price = ((this.price * 100) / 100).toFixed(2);
  next();
});

productSchema.pre(/^find/, function (next) {
  this.find({ isDeleted: false });
  next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
