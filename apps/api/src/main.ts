import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AppConfigService } from './core/config/app-config.service';
import { setupSwagger } from './core/swagger/setup-swagger';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const appConfig = app.get(AppConfigService);
  app.setGlobalPrefix('api');
  app.use(helmet());
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: appConfig.getCorsOrigin(),
    credentials: true,
  });
  if (appConfig.isSwaggerEnabled()) {
    setupSwagger(app);
  }
  await app.listen(appConfig.getPort());
}

void bootstrap();
