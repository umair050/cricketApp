import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'], // Enable detailed logging
  });
  
  // Enable CORS for frontend AND mobile devices
  app.enableCors({
    origin: true, // Allow all origins (mobile app can connect)
    credentials: true,
  });
  
  // Log all incoming requests
  app.use((req, res, next) => {
    console.log(`📱 ${req.method} ${req.url} - From: ${req.headers['user-agent']?.substring(0, 50) || 'Unknown'}`);
    next();
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Cricket Player Platform API')
    .setDescription('API for managing cricket players, teams, and tournaments')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001, '0.0.0.0'); // Listen on all network interfaces
  console.log('🏏 Cricket App Backend running on http://localhost:3001');
  console.log('📱 Mobile devices can connect via: http://192.168.18.11:3001');
  console.log('📚 API Documentation available at http://localhost:3001/api');
}
bootstrap();