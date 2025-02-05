import { Prisma } from '@prisma/client';
import { Response } from 'express';

export const handlePrismaError = (e: unknown, res: Response) => {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    switch (e.code) {
      case 'P2002':
        return res.status(409).json({
          message: '중복된 데이터가 존재합니다.',
        });
      case 'P2003':
        return res.status(400).json({
          message: '관련된 데이터가 존재하지 않습니다.',
        });
      case 'P2014':
        return res.status(400).json({
          message: '관계 제약 조건을 위반했습니다.',
        });
      default:
        return res.status(500).json({
          message: '데이터베이스 오류가 발생했습니다.',
        });
    }
  }

  if (e instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      message: '잘못된 데이터 형식입니다.',
    });
  }

  return res.status(500).json({
    message: '알 수 없는 데이터베이스 오류가 발생했습니다.',
  });
};
