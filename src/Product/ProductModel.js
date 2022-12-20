const mongoose = require('mongoose');
const npmValidate = require('validator');

const productSchema = mongoose.Schema(
  {
    //   title: {string, mandatory, unique},
    title: {
      type: String,
      required: [true, 'Please provide a title of product!'],
      unique: true,
    },
    //   description: {string, mandatory},
    description: {
      type: String,
      required: [true, 'Please provide description of product!'],
    },
    //   price: {number, mandatory, valid number/decimal},
    price: {
      type: Number,
      required: [true, 'Please provide price of product!'],
      validate: {
        validator: (el) => el >= 0,
        message: 'Price should be greater than zero!',
      },
    },
    //   currencyId: {string, mandatory, INR},
    currencyId: {
      type: String,
      required: [true, 'Please provide currency id!'],
    },
    //   currencyFormat: {string, mandatory, Rupee symbol},
    currencyFormat: {
      type: String,
      required: [true, 'Please provide currencyFormat!'],
    },
    //   isFreeShipping: {boolean, default: false},
    isFreeShipping: {
      type: Boolean,
      default: false,
    },
    //   productImage: {string, mandatory},  // s3 link
    productImage: {
      type: String,
      required: [true, 'Please provide image of product!'],
    },
    //   style: {string},
    style: String,
    //   availableSizes: ['S', 'XS', 'M', 'X', 'L', 'XXL', 'XL'],
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
    //   installments: {number},//     style
    installments: Number,
    //   deletedAt: {Date, when the document is deleted},
    deletedAt: {
      type: Date,
      default: null,
    },
    //   isDeleted: {boolean, default: false},
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

productSchema.pre('save', function (next) {
  this.price = ((this.price * 100) / 100).toFixed(2);
  this.installments = this.installments.toFixed(0);
  next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
// - Product Model
// {
//   title: {string, mandatory, unique},
//   description: {string, mandatory},
//   price: {number, mandatory, valid number/decimal},
//   currencyId: {string, mandatory, INR},
//   currencyFormat: {string, mandatory, Rupee symbol},
//   isFreeShipping: {boolean, default: false},
//   productImage: {string, mandatory},  // s3 link
//   style: {string},
//   availableSizes: {array of string, at least one size, enum["S", "XS","M","X", "L","XXL", "XL"]},
//   installments: {number},
//   deletedAt: {Date, when the document is deleted},
//   isDeleted: {boolean, default: false},
//   createdAt: {timestamp},
//   updatedAt: {timestamp},
// }

// {
//   _id: ObjectId("88abc190ef0288abc190ef55"),
//   title: 'Nit Grit',
//   description: 'Dummy description',
//   price: 23.0,
//   currencyId: 'INR',
//   currencyFormat: '₹',
//   isFreeShipping: false,
//   productImage: 'http://function-up-test.s3.amazonaws.com/products/product/nitgrit.jpg',
//   ? // s3 link
//     style
//   : 'Colloar',
//   availableSizes: ['S', 'XS', 'M', 'X', 'L', 'XXL', 'XL'],
//   installments: 5,
//   deletedAt: null,
//   isDeleted: false,
//   createdAt: '2021-09-17T04:25:07.803Z',
//   updatedAt: '2021-09-17T04:25:07.803Z',
// }
// ```
