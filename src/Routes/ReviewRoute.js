const router = require('express').Router();
const review = require('../Controllers/reviewController');
const auth = require('../MiddleWare/authoriZation');
router
  .route('/')
  .post(auth.protect, auth.restrictTo('user'), review.createReview)
  .get(auth.protect, auth.restrictTo('user'), review.getReview);

router
  .route('/:reviewId')
  .put(auth.protect, auth.restrictTo('user'), review.updateReview)
  .delete(auth.protect, auth.restrictTo('admin'), review.deleteReview);

module.exports = router;
