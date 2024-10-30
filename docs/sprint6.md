# 요구사항

## 기본 요구사항

### 중고마켓

- [x] Product 스키마를 작성해 주세요.

  - [x] id, name, description, price, tags, createdAt, updatedAt필드를 가집니다.
  - [x] 필요한 필드가 있다면 자유롭게 추가해 주세요.

- [x] 상품 등록 API를 만들어 주세요.
  - [x] name, description, price, tags를 입력하여 상품을 등록합니다.
- [x] 상품 상세 조회 API를 만들어 주세요.
  - [x] id, name, description, price, tags, createdAt를 조회합니다.
- [ ] 상품 수정 API를 만들어 주세요.
  - [ ] PATCH 메서드를 사용해 주세요.
- [ ] 상품 삭제 API를 만들어 주세요.

- [ ] 상품 목록 조회 API를 만들어 주세요.

  - [ ] id, name, price, createdAt를 조회합니다.
  - [ ] offset 방식의 페이지네이션 기능을 포함해 주세요.
  - [ ] 최신순(recent)으로 정렬할 수 있습니다.
  - [ ] name, description에 포함된 단어로 검색할 수 있습니다.

- [ ] 각 API에 적절한 에러 처리를 해 주세요.
- [ ] 각 API 응답에 적절한 상태 코드를 리턴하도록 해 주세요.
- [ ] . env 파일에 환경 변수를 설정해 주세요.
- [ ] CORS를 설정해 주세요.
- [ ] render.com로 배포해 주세요.
- [ ] MongoDB를 활용해 주세요.
