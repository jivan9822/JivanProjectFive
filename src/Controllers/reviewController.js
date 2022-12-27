const AppError = require('../Error/AppError');
const { CatchAsync } = require('../Error/CatchAsync');
const Review = require('../Models/reviewModel');

exports.createReview = CatchAsync(async (req, res, next) => {
  req.body.userId = req.user._id;
  const review = await Review.create(req.body);
  res.status(201).json({
    status: true,
    message: 'Review created success!',
    data: {
      review,
    },
  });
});
exports.getReview = CatchAsync(async (req, res, next) => {
  const review = await Review.find({ userId: req.user._id });
  if (!review.length) {
    return next(new AppError('You have no review yet', 404));
  }
  res.status(200).json({
    status: true,
    result: `${review.length} reviews found!`,
    data: {
      review,
    },
  });
});
exports.updateReview = CatchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review) {
    return next(new AppError('No review found with this id!', 404));
  }
  if (review.userId.equals(req.user._id)) {
    review.rating = req.body.rating;
    review.review = req.body.review;
    await review.save();
    return res.status(200).json({
      status: true,
      message: 'Review updated success!',
      data: {
        review,
      },
    });
  }
  return next(
    new AppError('You are not authorized to perform this operation!', 403)
  );
});
exports.deleteReview = CatchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.reviewId);
  if (!review) {
    return next(new AppError('No review found with this id!', 404));
  }
  return res.status(204).json({
    status: true,
    message: 'Review updated success!',
    data: {
      review,
    },
  });
});
