import jwt from 'jsonwebtoken';

export const generateTokens = (userId: number) => {
  return {
    accessToken: generateAccessToken(userId),
    refreshToken: generateRefreshToken(userId),
  };
};

export const generateAccessToken = (userId: number) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '1d' });
};

const generateRefreshToken = (userId: number) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '2d' });
};
