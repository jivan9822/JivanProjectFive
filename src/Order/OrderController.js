const { CatchAsync } = require('../Error/CatchAsync');

// ### POST /users/:userId/orders
exports.createOrder = CatchAsync(async (req, res, next) => {});
// - Create an order for the user
// - Make sure the userId in params and in JWT token match.
// - Make sure the user exist
//     - Get cart details in the request body

// ### Successful Response structure

// ```yaml
// { status: true, message: 'Success', data: {} }

// ```yaml
// { status: false, message: '' }
