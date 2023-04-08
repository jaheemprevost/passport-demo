const mongoose = require('mongoose');

const connectDB = async (connectionUri) => {
  try {
    await mongoose.connect(connectionUri);
    console.log('Connected to database');
  } catch(err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;
