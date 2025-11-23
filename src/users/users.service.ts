import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * UsersService - Business Logic Layer for User Operations
 * 
 * DESIGN PATTERN: Service Layer Pattern
 * This service encapsulates all business logic related to users.
 * It follows the Single Responsibility Principle (SRP) by handling only user-related operations.
 * 
 * DEPENDENCY INJECTION:
 * The @Injectable() decorator marks this class as a provider that can be managed by NestJS's IoC container.
 * This allows NestJS to automatically inject dependencies (like PrismaService) into this class.
 */
@Injectable()
export class UsersService {
  /**
   * Constructor-based Dependency Injection
   * 
   * We inject PrismaService to interact with the database.
   * The 'private' keyword automatically creates and assigns a class property.
   * This is a TypeScript shorthand that's equivalent to:
   *   private prisma: PrismaService;
   *   constructor(prisma: PrismaService) { this.prisma = prisma; }
   */
  constructor(private readonly prisma: PrismaService) { }

  /**
   * Create a new user
   * 
   * SECURITY: Password Hashing
   * We hash the password using bcrypt before storing it in the database.
   * This ensures passwords are never stored in plain text.
   * 
   * BCRYPT:
   * - Uses a salt to prevent rainbow table attacks
   * - Computationally expensive (intentionally slow) to prevent brute force
   * - Salt rounds (10) determines the cost factor
   * 
   * @param createUserDto - Data Transfer Object containing user creation data
   * @returns Promise<User> - The newly created user object
   */
  async create(createUserDto: CreateUserDto) {
    /**
     * HASH PASSWORD:
     * bcrypt.hash() generates a salt and hashes the password.
     * The second parameter (10) is the number of salt rounds.
     * Higher = more secure but slower. 10 is a good balance.
     */
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create user with hashed password
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
      // Don't return the password in the response
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Retrieve all users
   * 
   * BEST PRACTICE: Selective Field Return
   * We exclude the password field for security reasons.
   * Never expose sensitive data like passwords in API responses.
   * 
   * @returns Promise<User[]> - Array of all users without password field
   */
  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        // password is intentionally excluded for security
      },
    });
  }

  /**
   * Retrieve a single user by ID
   * 
   * ERROR HANDLING:
   * We throw a NotFoundException if the user doesn't exist.
   * NestJS will automatically convert this to a 404 HTTP response.
   * 
   * @param id - User ID to find
   * @returns Promise<User> - The found user without password
   * @throws NotFoundException - If user is not found
   */
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * Update a user's information
   * 
   * PARTIAL UPDATES:
   * UpdateUserDto uses PartialType, so only provided fields will be updated.
   * This follows the PATCH HTTP method semantics.
   * 
   * @param id - User ID to update
   * @param updateUserDto - Partial user data to update
   * @returns Promise<User> - The updated user
   * @throws NotFoundException - If user is not found
   */
  async update(id: number, updateUserDto: UpdateUserDto) {
    // First, verify the user exists
    await this.findOne(id);

    // Update the user with the provided data
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Delete a user
   * 
   * SOFT DELETE vs HARD DELETE:
   * This is a hard delete (permanently removes the record).
   * For production apps, consider implementing soft deletes with a 'deletedAt' timestamp.
   * 
   * @param id - User ID to delete
   * @returns Promise<User> - The deleted user
   * @throws NotFoundException - If user is not found
   */
  async remove(id: number) {
    // Verify user exists before attempting deletion
    await this.findOne(id);

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
