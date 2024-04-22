import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import { CORS } from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 8000;
  app.use(morgan('dev'));
  app.setGlobalPrefix('api');
  app.enableCors(CORS);
  await app.listen(PORT);
}
bootstrap();
