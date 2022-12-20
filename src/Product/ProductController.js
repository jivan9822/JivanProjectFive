const { CatchAsync } = require('../Error/CatchAsync');
const AppError = require('../Error/AppError');
const Product = require('./ProductModel');

exports.createProduct = CatchAsync(async (req, res, next) => {
  req.body.product = req.body.product ? JSON.parse(req.body.product) : null;
  if (!req.body.product) {
    return next(
      new AppError(
        `Body is empty! Please provide products details in body.`,
        400
      )
    );
  }
  req.body.product.productImage = req.image;
  const product = await Product.create(req.body.product);
  res.status(201).json({
    status: true,
    message: 'Success',
    data: {
      product,
    },
  });
});

exports.getProductDetails = CatchAsync(async (req, res, next) => {
  res.send('productDetails!');
});

/*### GET /products

- Returns all products in the collection that aren't deleted.
  - **Filters**
    - Size (The key for this filter will be 'size')
    - Product name (The key for this filter will be 'name'). You should return all the products with name containing the substring recieved in this filter
    - Price : greater than or less than a specific value. The keys are 'priceGreaterThan' and 'priceLessThan'.

> **_NOTE:_** For price filter request could contain both or any one of the keys. For example the query in the request could look like { priceGreaterThan: 500, priceLessThan: 2000 } or just { priceLessThan: 1000 } )

- **Sort**
  - Sorted by product price in ascending or descending. The key value pair will look like {priceSort : 1} or {priceSort : -1}
    _eg_ /products?size=XL&name=Nit%20grit
- **Response format**
  - _**On success**_ - Return HTTP status 200. Also return the product documents. The response should be a JSON object like [this](#successful-response-structure)
  - _**On error**_ - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like [this](#error-response-structure)
  */
