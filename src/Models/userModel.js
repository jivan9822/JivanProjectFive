const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const npmValidator = require('validator');

// ADDRESS SCHEMA
const addressSchema = mongoose.Schema({
  street: {
    type: String,
    required: [true, 'Please add street name!'],
  },
  // city: {string, mandatory},
  city: {
    type: String,
    required: [true, 'Please add city name!'],
  },
  // pincode: {number, mandatory}
  pincode: {
    type: Number,
    required: [true, 'Please add pincode name!'],
    validate: {
      validator: (pin) => /^\d{6}$/.test(pin),
      message: 'pin number should be 6 digit long!',
    },
  },
});

// USER SCHEMA
const userSchema = mongoose.Schema(
  {
    //   fname: {string, mandatory},
    fname: {
      type: String,
      required: [true, 'Please provide First Name'],
      validate: {
        validator: (el) => npmValidator.isAlpha(el),
        message: 'Please enter only alphabets!',
      },
    },
    //   lname: {string, mandatory},
    lname: {
      type: String,
      required: [true, 'Please provide Last Name'],
      validate: {
        validator: (el) => npmValidator.isAlpha(el),
        message: 'Please enter only alphabets!',
      },
    },
    //   email: {string, mandatory, valid email, unique},
    email: {
      type: String,
      required: [true, 'Please provide a email!'],
      unique: true,
      validate: {
        validator: (el) => npmValidator.isEmail(el),
        message: 'Invalid email!',
      },
    },
    roll: {
      type: String,
      required: [true, 'Please provide roll of user!'],
      default: 'user',
    },
    //   profileImage: {string, mandatory}, // s3 link
    profileImage: {
      type: String,
      required: [true, 'Please provide profile image'],
    },
    //   phone: {string, mandatory, unique, valid Indian mobile number},
    phone: {
      type: String,
      required: [true, 'Please provide use phone number'],
      unique: true,
      validate: {
        validator: (el) => npmValidator.isMobilePhone(el, ['en-IN']),
      },
    },
    //   password: {string, mandatory, minLen 8, maxLen 15}, // encrypted password
    password: {
      type: String,
      required: [true, 'Please provide a password!'],
      match: [
        /^.{8,15}$/,
        'password should be min length is 8 and max length is 15',
      ],
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, 'Please provide a password!'],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
      },
    },
    address: {
      shipping: {
        type: addressSchema,
        required: [true, 'Please Provide Shipping address'],
      },
      billing: {
        type: addressSchema,
        required: [true, 'Please Provide Billing address'],
      },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    passwordChangedAt: Date,
    cart: {
      type: mongoose.Types.ObjectId,
    },
    order: {
      type: mongoose.Types.ObjectId,
    },
  },
  { timestamps: true }
);

// BCRYPT PASSWORD
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

// METHOD FOR VERIFICATION OF PASSWORD
userSchema.methods.correctPass = async function (ogPass, hashPass) {
  return await bcrypt.compare(ogPass, hashPass);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.pre(/^find/, function (next) {
  this.find({ isDeleted: false });
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
