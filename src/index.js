const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config({ path: 'config.env' });
const app = express();
app.use(express.json());

mongoose.set('strictQuery', true);
mongoose
  .connect(process.env.MONGODB)
  .then(() => console.log('Connected to MONGODB!'))
  .catch((err) => console.log('Mongoose:', err));

const port = process.env.PORT || 4100;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
