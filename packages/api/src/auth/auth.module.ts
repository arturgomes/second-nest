import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma.service';

/**
 * AuthModule - Authentication Feature Module
 * 
 * JWT CONFIGURATION:
 * The JwtModule is configured with:
 * - secret: Used to sign and verify tokens (should be in environment variables in production)
 * - signOptions: Token expiration time
 * 
 * SECURITY NOTE:
 * In production, move the secret to environment variables:
 * secret: process.env.JWT_SECRET
 */
@Module({
  imports: [
    /**
     * JWT MODULE REGISTRATION:
     * JwtModule.register() configures the JWT service globally for this module.
     * 
     * CONFIGURATION OPTIONS:
     * - global: true - Makes JwtService available throughout the app without importing
     * - secret: The secret key used to sign tokens (CHANGE THIS IN PRODUCTION!)
     * - signOptions: Additional options like expiration time
     */
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
      signOptions: {
        expiresIn: '24h', // Token expires in 24 hours
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
  /**
   * EXPORTS:
   * We export AuthService so other modules can use it if needed
   * (e.g., for programmatic token generation in tests)
   */
  exports: [AuthService],
})
export class AuthModule { }
