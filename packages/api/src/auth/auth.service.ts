import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma.service';
import { LoginDto } from './dto/login.dto';

/**
 * AuthService - Authentication Business Logic
 * 
 * RESPONSIBILITY:
 * This service handles authentication operations:
 * - Validating user credentials
 * - Generating JWT tokens
 * - Password verification
 * 
 * SECURITY BEST PRACTICES:
 * - Passwords are hashed with bcrypt (never stored in plain text)
 * - JWT tokens are signed and can be verified
 * - Failed login attempts throw UnauthorizedException
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  /**
   * Validate user credentials and generate JWT token
   * 
   * AUTHENTICATION FLOW:
   * 1. Find user by email
   * 2. Verify password using bcrypt
   * 3. Generate JWT token with user payload
   * 4. Return token and user info
   * 
   * @param loginDto - User credentials
   * @returns Object with access_token and user info
   * @throws UnauthorizedException - If credentials are invalid
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // Check if user exists
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    /**
     * JWT PAYLOAD:
     * The payload contains claims about the user.
     * Keep it minimal - don't include sensitive data.
     * Common claims: sub (subject/user ID), email, roles
     */
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
    };

    /**
     * JWT TOKEN GENERATION:
     * JwtService.sign() creates a signed token using the secret key.
     * The token can be verified later to authenticate requests.
     */
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    };
  }

  /**
   * Verify and decode a JWT token
   * 
   * TOKEN VERIFICATION:
   * This method verifies the token signature and decodes the payload.
   * Used by the JwtAuthGuard to authenticate requests.
   * 
   * @param token - JWT token to verify
   * @returns Decoded payload
   * @throws UnauthorizedException - If token is invalid or expired
   */
  async verifyToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
