import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../prismaClient.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

const validateSignup = [
  body('email').isEmail().withMessage('유효한 이메일 주소를 입력해 주세요.'),
  body('nickname').notEmpty().withMessage('닉네임은 필수입니다.'),
  body('password').isLength({ min: 6 }).withMessage('비밀번호는 최소 8자 이상이어야 합니다.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateLogin = [
  body('email').isEmail().withMessage('이메일을 입력해 주세요.'),
  body('password').notEmpty().withMessage('비밀번호를 입력해주세요.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// 회원가입 API
router.post('/signup', validateSignup, async (req, res) => {
  const { email, nickname, password } = req.body;

  try {
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const newUser = await prisma.user.create({
      data: {
        email,
        nickname,
        password: hashedPassword,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: '회원가입 중 오류가 발생했습니다.', error });
  }
});

// JWT 생성 함수
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

// 로그인 API
router.post('/login', validateLogin, async (req, res) => {
  const { email, password } = req.body;

  try {
    // 사용자 조회
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }

    // 비밀번호 검증
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }

    // JWT 생성
    const { accessToken, refreshToken } = generateTokens(user);

    res.status(200).json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        image: user.image || null,
        nickname: user.nickname,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    res.status(500).json({ message: '로그인 중 오류가 발생했습니다.', error });
  }
});

export default router;

