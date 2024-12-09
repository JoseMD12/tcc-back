import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Settings } from 'luxon';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  Settings.defaultZone = 'utc';

  await app.listen(3000);
}
bootstrap();
