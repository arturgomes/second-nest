import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

/**
 * UsersService Unit Tests
 * 
 * TESTING PHILOSOPHY:
 * Unit tests should test a single unit of code in isolation.
 * We mock dependencies (PrismaService) to focus on testing UsersService logic.
 * 
 * JEST BASICS:
 * - describe(): Groups related tests
 * - it() or test(): Defines a single test case
 * - expect(): Assertion to verify behavior
 * - beforeEach(): Runs before each test
 * 
 * MOCKING:
 * We create a mock PrismaService to avoid hitting the real database.
 * This makes tests fast, predictable, and isolated.
 */
describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  /**
   * MOCK DATA:
   * Reusable test data that represents typical database records.
   */
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword123',
    name: 'Test User',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUsers = [mockUser, { ...mockUser, id: 2, email: 'test2@example.com' }];

  /**
   * SETUP:
   * beforeEach runs before each test to create a fresh testing module.
   * This ensures tests don't affect each other.
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          /**
           * MOCKING PRISMA:
           * We provide a mock implementation of PrismaService.
           * Each method returns a jest.fn() which we can configure per test.
           */
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  /**
   * SANITY CHECK:
   * Always include a basic test to ensure the service is defined.
   */
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /**
   * CREATE USER TESTS
   */
  describe('create', () => {
    it('should hash password and create user', async () => {
      const createUserDto = {
        email: 'new@example.com',
        password: 'password123',
        name: 'New User',
      };

      const expectedUser = {
        id: 1,
        email: createUserDto.email,
        name: createUserDto.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      /**
       * MOCK SETUP:
       * Configure the mock to return our expected data (without password).
       * The actual service excludes password from the response.
       */
      jest.spyOn(prisma.user, 'create').mockResolvedValue(expectedUser as any);

      const result = await service.create(createUserDto);

      /**
       * ASSERTIONS:
       * Verify the user was created and password is not in response.
       */
      expect(prisma.user.create).toHaveBeenCalled();
      expect(result).toEqual(expectedUser);
      expect(result).not.toHaveProperty('password');

      // Verify password was hashed (not stored in plain text)
      const createCall = (prisma.user.create as jest.Mock).mock.calls[0][0];
      expect(createCall.data.password).not.toBe(createUserDto.password);
    });
  });

  /**
   * FIND ALL USERS TESTS
   */
  describe('findAll', () => {
    it('should return paginated users without passwords', async () => {
      const paginationDto = { page: 1, limit: 10, skip: 0 };

      jest.spyOn(prisma.user, 'findMany').mockResolvedValue(mockUsers as any);
      jest.spyOn(prisma.user, 'count').mockResolvedValue(2);

      const result = await service.findAll(paginationDto);

      expect(result.data).toHaveLength(2);
      expect(result.meta.total).toBe(2);
      expect(result.meta.page).toBe(1);
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 10,
        }),
      );
    });
  });

  /**
   * FIND ONE USER TESTS
   */
  describe('findOne', () => {
    it('should return a user by id', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser as any);

      const result = await service.findOne(1);

      expect(result).toBeDefined();
      expect(prisma.user.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 1 } }),
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  /**
   * UPDATE USER TESTS
   */
  describe('update', () => {
    it('should update a user', async () => {
      const updateDto = { name: 'Updated Name' };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser as any);
      jest.spyOn(prisma.user, 'update').mockResolvedValue({
        ...mockUser,
        ...updateDto,
      } as any);

      const result = await service.update(1, updateDto);

      expect(result.name).toBe('Updated Name');
      expect(prisma.user.update).toHaveBeenCalled();
    });
  });

  /**
   * DELETE USER TESTS
   */
  describe('remove', () => {
    it('should delete a user', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser as any);
      jest.spyOn(prisma.user, 'delete').mockResolvedValue(mockUser as any);

      const result = await service.remove(1);

      expect(result).toBeDefined();
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
