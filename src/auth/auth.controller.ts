import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

/**
 * AuthController - Authentication HTTP Endpoints
 * 
 * PUBLIC ENDPOINTS:
 * Authentication endpoints are typically public (no auth guard).
 * Users need to be able to login without already being authenticated.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  /**
   * POST /auth/login - Authenticate user and get JWT token
   * 
   * LOGIN FLOW:
   * 1. Client sends email and password
   * 2. Server validates credentials
   * 3. Server generates JWT token
   * 4. Client stores token (usually in localStorage or httpOnly cookie)
   * 5. Client includes token in subsequent requests (Authorization header)
   * 
   * RESPONSE FORMAT:
   * {
   *   "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
   *   "user": {
   *     "id": 1,
   *     "email": "user@example.com",
   *     "name": "John Doe"
   *   }
   * }
   * 
   * @param loginDto - User credentials
   * @returns JWT token and user info
   * @throws UnauthorizedException - If credentials are invalid (401)
   */
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
