const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect("mongodb://0.0.0.0:27017/attendenceDB");
    console.log("MongoDB Connected: "); // + conn.connection.host
  } catch (error) {
    console.log("Error: " + error);
    process.exit();
  }
};

module.exports = connectDB;
