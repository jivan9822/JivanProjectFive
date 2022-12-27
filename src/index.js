require('dotenv').config({ path: 'config.env' });
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const userRoute = require('./Routes/UserRoute');
const productRoute = require('./Routes/ProductRoute');
const orderRoute = require('./Routes/OrderRoute');
const cartRoute = require('./Routes/CartRoute');
const AppError = require('./Error/AppError');
const { globalErrorHandler } = require('./Error/GlobalError');

const app = express();

app.use(express.json());
app.use(multer().any());

mongoose.set('strictQuery', true);
mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    console.log('Connected to mongoDb!');
  })
  .catch((err) => console.log(err));

// ALL ROUTER
app.use('/user', userRoute);
app.use('/products', productRoute);
app.use('/cart', cartRoute);
app.use('/order', orderRoute);

app.all('*', (req, res, next) => {
  return next(new AppError(`The ${req.originalUrl} not found on server!`));
});

app.use(globalErrorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server start running on port ${port}`));
