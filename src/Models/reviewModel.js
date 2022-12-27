const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
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
});

reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
