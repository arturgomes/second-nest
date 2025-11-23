import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

/**
 * Bootstrap function - Application Entry Point
 * 
 * This is where the NestJS application is created and configured.
 * It's called when the application starts.
 */
async function bootstrap() {
  // Create the NestJS application instance
  const app = await NestFactory.create(AppModule);

  /**
   * CORS CONFIGURATION
   * 
   * Enable Cross-Origin Resource Sharing to allow the Next.js frontend
   * to make requests to this API from a different origin (port 3001).
   */
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3000'],
    credentials: true,
  });

  /**
   * GLOBAL VALIDATION PIPE
   * 
   * WHAT ARE PIPES?
   * Pipes are a powerful feature in NestJS that transform or validate data
   * before it reaches the route handler. They operate on the arguments being
   * processed by a controller method.
   * 
   * VALIDATION PIPE:
   * The ValidationPipe automatically validates incoming request data against
   * the DTO class using class-validator decorators.
   * 
   * CONFIGURATION OPTIONS:
   * - whitelist: true - Strips properties that don't have decorators in the DTO
   *   This prevents clients from sending extra fields that aren't expected.
   * 
   * - forbidNonWhitelisted: true - Throws an error if extra properties are sent
   *   This is more strict than whitelist and helps catch client-side bugs.
   * 
   * - transform: true - Automatically transforms payloads to DTO instances
   *   This also transforms primitive types (e.g., string "123" to number 123)
   *   based on the DTO property types.
   * 
   * WHY GLOBAL?
   * By applying it globally, we don't need to add @UsePipes(ValidationPipe)
   * to every controller or route handler. DRY principle in action!
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Start the HTTP server on the specified port
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
