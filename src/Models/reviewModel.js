const mongoose = require('mongoose');
const Product = require('./productModel');

const reviewSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user id'],
    },
    productId: {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Please provide product id'],
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating for the product'],
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      required: [true, 'Please provide your review for this product!'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

reviewSchema.statics.calcAveRating = async function (prodId) {
  const stats = await this.aggregate([
    {
      $match: { productId: prodId },
    },
    {
      $group: {
        _id: '$productId',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length) {
    await Product.findByIdAndUpdate(prodId, {
      reviewCount: stats[0].nRating,
      reviewAvg: stats[0].avgRating,
    });
  } else {
    await Product.findByIdAndUpdate(prodId, {
      reviewCount: 0,
      reviewAvg: 0,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAveRating(this.productId);
});

reviewSchema.pre(/^findOne/, async function (next) {
  this.r = await this.find().clone();
  next();
});

reviewSchema.post(/^findOne/, async function () {
  await this.r[0].constructor.calcAveRating(this.r[0].productId);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
