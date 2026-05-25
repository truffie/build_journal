import type { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { createOpenApiDocument } from './create-openapi-document';

export function setupSwagger(app: INestApplication): void {
  const document = createOpenApiDocument(app);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: { persistAuthorization: true },
    jsonDocumentUrl: 'swagger-json',
  });
}
