import mongoose from "mongoose";
import * as dotenv from 'dotenv';

dotenv.config();

const connect = () => {
  mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("DB 연결 성공");
  })
  .catch((error) => {
    console.log("DB 연결 실패: ",error);
  })
}

export default connect;
