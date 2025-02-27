import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

// PrismaService 클래스 정의: PrismaClient를 확장하여 Prisma 데이터베이스와 연결하는 역할을 합니다.
@Injectable() // 이 클래스가 NestJS 의존성 주입 시스템에서 사용될 수 있게 해줍니다.
// PrismaClient를 상속받습니다. PrismaClient는 데이터베이스와 상호작용을 위한 기본 클래스입니다.
// OnModuleInit 인터페이스를 구현하여 모듈 초기화 시 할 일을 지정합니다.
export class PrismaService
  extends PrismaClient<
    Prisma.PrismaClientOptions,
    'query' | 'info' | 'warn' | 'error' | 'beforeExit'
  >
  implements OnModuleInit
{
  private static instance: PrismaService; // PrismaService의 인스턴스를 하나만 만들기 위한 변수 (싱글톤 패턴)

  // 생성자에서 설정 파일을 가져와 데이터베이스 URL을 설정합니다.
  constructor(private readonly config: ConfigService) {
    super({
      // 데이터베이스와 연결할 정보 설정
      datasources: {
        db: {
          // 환경변수에서 DATABASE_URL을 가져옵니다.
          url: config.get<string>('DATABASE_URL'),
        },
      } as Prisma.Datasources,
    });
  }

  // 싱글톤 패턴을 사용하여 PrismaService의 인스턴스를 하나만 만들도록 하는 메서드
  static async getInstance(): Promise<PrismaService> {
    // 인스턴스가 없으면 새로 생성
    if (!PrismaService.instance) {
      // ConfigService를 사용해 새 인스턴스를 생성
      PrismaService.instance = new PrismaService(new ConfigService());
      // 데이터베이스와 비동기 연결
      await PrismaService.instance.$connect();
    }
    // 이미 존재하는 인스턴스를 반환
    return PrismaService.instance;
  }

  // NestJS 모듈이 초기화될 때 Prisma와의 연결을 설정하는 메서드
  async onModuleInit() {
    await this.$connect(); // PrismaClient의 데이터베이스 연결을 비동기적으로 처리
  }

  // 앱 종료 시 Prisma가 제대로 종료되도록 설정하는 메서드
  async enableShutdownHooks(app: INestApplication) {
    // Prisma가 종료되기 전에 실행할 이벤트 핸들러 설정
    // 애플리케이션 종료 시 Prisma 연결을 닫습니다.
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.$on('beforeExit', async () => {
      await app.close();
    });
    await Promise.resolve(); // Add an await expression to avoid the compile error
  }
}
