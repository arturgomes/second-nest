import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma.service';

/**
 * UsersModule - Feature Module for User Management
 * 
 * MODULAR ARCHITECTURE:
 * NestJS uses modules to organize the application into cohesive blocks of functionality.
 * Each module encapsulates a closely related set of capabilities.
 * 
 * BENEFITS:
 * - Clear boundaries between features
 * - Better code organization
 * - Easier testing and maintenance
 * - Lazy loading capabilities
 * 
 * @Module() DECORATOR PROPERTIES:
 * - controllers: HTTP request handlers
 * - providers: Services, repositories, factories, helpers, etc.
 * - imports: Other modules whose providers are needed
 * - exports: Providers that should be available to other modules
 */
@Module({
  /**
   * CONTROLLERS:
   * Controllers registered here will be instantiated by NestJS.
   * They handle incoming HTTP requests for this module.
   */
  controllers: [UsersController],

  /**
   * PROVIDERS:
   * Services and other providers that belong to this module.
   * NestJS will instantiate these and manage their lifecycle.
   * 
   * DEPENDENCY INJECTION:
   * PrismaService is included here so it can be injected into UsersService.
   * This makes PrismaService available within this module's scope.
   */
  providers: [UsersService, PrismaService],

  /**
   * EXPORTS:
   * By exporting UsersService, we make it available to other modules that import UsersModule.
   * This is useful when other features need to interact with users (e.g., Posts needing to verify authors).
   * 
   * ENCAPSULATION:
   * Only exported providers are accessible outside the module.
   * This enforces proper boundaries and prevents tight coupling.
   */
  exports: [UsersService],
})
export class UsersModule { }
