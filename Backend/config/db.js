const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://kalyanigade4:i7zAJea6Z1nZl1Gl@cluster0.wuwty.mongodb.net/Innovity?retryWrites=true&w=majority");
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("MongoDB Connection Failed ❌", error);
    process.exit(1);
  }
};

module.exports = connectDB;