const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connection established to mongodb server");
  } catch (error) {
    console.log("Cannot connect to the mongodb server");
    process.exit(1);
  }
};

module.exports = connectDB;
