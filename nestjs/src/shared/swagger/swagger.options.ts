import {
  DocumentBuilder,
  OpenAPIObject,
  SwaggerCustomOptions,
} from '@nestjs/swagger';

const swaggerCustomOptions = () => {
  const result: SwaggerCustomOptions = {
    customSiteTitle: '판다마켓 API by 대원',
  };
  return result;
};

const swaggerOption = (): Omit<OpenAPIObject, 'paths'> => {
  const options = new DocumentBuilder()
    .setTitle('판다마켓 API')
    .setDescription('판다마켓 API 명세서')
    .setVersion('1.0')
    .addTag('Users', '사용자 관리')
    .addTag('Products', '상품 관리')
    .addTag('Image', '이미지 관리')
    .addTag('Comments', '댓글 관리')
    .addTag('Auth', '인증 관리')
    .addTag('Posts', '게시글 관리')
    .build();

  return options;
};

const docsOptions = {
  swagger: swaggerOption,
  swaggerCustom: swaggerCustomOptions,
};

export default docsOptions;
