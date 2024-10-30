const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB 연결 성공");
  } catch (error) {
    console.error("DB 연결 실패", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
