const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const AppError = require('./Error/AppError');
const { globalErrorHand } = require('./Error/GlobalError');

const userRoute = require('./User/UserRoute');

require('dotenv').config({ path: 'config.env' });
const app = express();
app.use(express.json());
app.use(multer().any());

mongoose.set('strictQuery', true);
mongoose
  .connect(process.env.MONGODB)
  .then(() => console.log('Connected to MONGODB!'))
  .catch((err) => console.log('Mongoose:', err));

app.use('/user', userRoute);

app.all('*', (req, res, next) => {
  next(new AppError(`The Url ${req.originalUrl} not found on server!`, 404));
});

app.use(globalErrorHand);

const port = process.env.PORT || 4100;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
