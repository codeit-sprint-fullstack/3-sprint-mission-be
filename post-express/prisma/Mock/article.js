export const ARTICLE = [
  {
    "id": 1,
    "title": "Prisma 시작하기",
    "content": "Prisma는 ORM 도구로, 데이터베이스를 쉽게 관리할 수 있습니다.",
    "createdAt": "2024-12-01T08:30:00.000Z",
    "updatedAt": "2024-12-01T09:00:00.000Z",
  },
  {
    "id": 2,
    "title": "Prisma의 주요 기능",
    "content": "Prisma의 주요 기능에는 schema 기반 데이터 모델링이 포함됩니다.",
    "favoriteCount": 20,    "createdAt": "2024-12-02T08:00:00.000Z",
    "updatedAt": "2024-12-02T08:45:00.000Z",
  },
  {
    "id": 3,
    "title": "TypeScript와 Prisma 사용법",
    "content": "TypeScript와 Prisma를 함께 사용하여 안전한 코드를 작성하세요.",
    "createdAt": "2024-12-03T07:00:00.000Z",
    "updatedAt": "2024-12-03T07:30:00.000Z",
  },
  {
    "id": 4,
    "title": "Prisma의 Migration",
    "content": "Migration을 사용하면 데이터베이스 스키마를 안전하게 변경할 수 있습니다.",
    "createdAt": "2024-12-03T10:00:00.000Z",
    "updatedAt": "2024-12-03T10:30:00.000Z",
  },
  {
    "id": 5,
    "title": "Prisma와 PostgreSQL 연결",
    "content": "PostgreSQL 데이터베이스를 Prisma로 관리하는 방법을 알아봅니다.",
    "createdAt": "2024-12-04T09:00:00.000Z",
    "updatedAt": "2024-12-04T09:30:00.000Z",
  },
]

export const ARTICLECOMMENT = [
  { 
    "id": 1, 
    "articleId": 1, 
    "content": "좋은 소개글이네요!", 
    "createdAt": "2024-12-01T10:00:00.000Z",
    "updatedAt": "2024-12-01T10:00:00.000Z" 
  },
  { "id": 2, 
    "articleId": 1, 
    "content": "다음 편도 기대됩니다.", 
    "createdAt": "2024-12-01T11:30:00.000Z",
    "updatedAt": "2024-12-01T11:30:00.000Z"
  },
  { "id": 3, 
    "articleId": 2, 
    "content": "유익한 내용 감사합니다.", 
    "createdAt": "2024-12-02T09:00:00.000Z" ,
    "updatedAt": "2024-12-02T09:00:00.000Z"
  },
  { 
    "id": 4, 
    "articleId": 2, 
    "content": "Prisma의 schema 파일이 궁금하네요.", 
    "createdAt": "2024-12-02T10:00:00.000Z",
    "updatedAt":  "2024-12-02T10:00:00.000Z"
  },
  { 
    "id": 5, 
    "articleId": 3, 
    "content": "TypeScript 초보자도 쉽게 배울 수 있을까요?", 
    "createdAt": "2024-12-03T08:00:00.000Z",
    "updatedAt": "2024-12-03T08:00:00.000Z"
  },
]