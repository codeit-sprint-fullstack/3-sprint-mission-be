import { throwUnauthorizedError } from "../../middlewares/auth.js";
import userRepository from "../../repositories/userRepository.js";
import jwt from "jsonwebtoken";

async function getUser(email, password) {
  const user = await userRepository.findById(email);
  if (!user) throwUnauthorizedError();
  verifyPassword(password, user.password);
  return userRepository.filterUserData(user);
}

async function getUserToken(email) {
  const user = await userRepository.findById(email);
  return userRepository.filterUserData(user);
}

function verifyPassword(password, userPassword) {
  if (password !== userPassword) throwUnauthorizedError();
  else return;
}

function createToken(user, type) {
  if (user) {
    const payload = { userId: user.email };
    const option = { expiresIn: type === "refresh" ? "2w" : "1h" };
    return jwt.sign(payload, process.env.JWT_SECRET, option);
  } else return null;
}

const test = async (req, res) => {
  try {
    res.send("성공");
  } catch (err) {
    console.error(err);
  }
};
const service = {
  getUser,
  getUserToken,
  createToken,
  verifyPassword,
  test,
};
export default service;
