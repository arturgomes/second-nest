import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { UnauthorizedException } from '@nestjs/common';

/**
 * MOCKING BCRYPT:
 * We mock the entire bcrypt module to avoid property redefinition errors.
 */
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

import * as bcrypt from 'bcryptjs';

/**
 * AuthService Unit Tests
 * 
 * AUTHENTICATION TESTING:
 * These tests verify the authentication logic including:
 * - Login with valid credentials
 * - Login with invalid credentials
 * - JWT token generation
 * - Token verification
 */
describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: '$2a$10$hashedPasswordExample', // Bcrypt hash format
    name: 'Test User',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /**
   * LOGIN TESTS
   */
  describe('login', () => {
    it('should return access token for valid credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockToken = 'mock.jwt.token';

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(mockToken);

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('access_token', mockToken);
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe(loginDto.email);
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      const loginDto = {
        email: 'wrong@example.com',
        password: 'password123',
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  /**
   * TOKEN VERIFICATION TESTS
   */
  describe('verifyToken', () => {
    it('should verify and decode valid token', async () => {
      const mockPayload = {
        sub: 1,
        email: 'test@example.com',
        name: 'Test User',
      };

      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(mockPayload);

      const result = await service.verifyToken('valid.token');

      expect(result).toEqual(mockPayload);
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      jest
        .spyOn(jwtService, 'verifyAsync')
        .mockRejectedValue(new Error('Invalid token'));

      await expect(service.verifyToken('invalid.token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
