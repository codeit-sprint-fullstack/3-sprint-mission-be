import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private readonly configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get<string>('DATABASE_URL'), // ✅ 환경 변수 사용
        },
      },
    });
  }
}
