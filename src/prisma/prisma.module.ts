import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config'; // ✅ ConfigModule 추가

@Module({
  imports: [ConfigModule], // ✅ ConfigModule 추가
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
