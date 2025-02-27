import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  SwaggerModule,
  SwaggerCustomOptions,
  OpenAPIObject,
} from '@nestjs/swagger';
import docsOptions from './shared/swagger/swagger.options';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // Create a new Nest application
  const customOption: SwaggerCustomOptions = docsOptions.swaggerCustom();
  const swaggerOptions: Omit<OpenAPIObject, 'paths'> = docsOptions.swagger();

  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api', app, document, customOption);

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:8080'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap().catch((error) => {
  console.error('Error during bootstrap:', error);
});
