import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function createOpenApiDocument(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Build Journal API')
    .setDescription('Строительный журнал работ — MVP')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Access token from POST /api/auth/login',
      },
      'access-token',
    )
    .build();
  return SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: true,
  });
}
