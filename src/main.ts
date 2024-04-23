import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import { CORS } from './constants';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 8000;
  app.use(morgan('dev'));
  app.useGlobalPipes(new ValidationPipe({
    transformOptions: {
      enableImplicitConversion: true
    }
  }));
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  app.setGlobalPrefix('api');
  app.enableCors(CORS);
  await app.listen(PORT);
}
bootstrap();
