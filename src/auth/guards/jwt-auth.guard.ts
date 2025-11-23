import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

/**
 * JwtAuthGuard - Custom Guard for JWT Authentication
 * 
 * WHAT ARE GUARDS?
 * Guards are a type of middleware in NestJS that determine whether a request
 * should be handled by the route handler or not. They're executed after middleware
 * but before pipes and interceptors.
 * 
 * AUTHENTICATION GUARD:
 * This guard extracts and verifies JWT tokens from the Authorization header.
 * If the token is valid, the request proceeds. If not, it throws UnauthorizedException.
 * 
 * USAGE:
 * Apply this guard to controllers or routes that require authentication:
 * @UseGuards(JwtAuthGuard)
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) { }

  /**
   * canActivate - Determines if the request can proceed
   * 
   * AUTHENTICATION FLOW:
   * 1. Extract token from Authorization header
   * 2. Verify token signature and expiration
   * 3. Attach user payload to request object
   * 4. Allow request to proceed
   * 
   * @param context - Execution context containing request information
   * @returns Promise<boolean> - True if authenticated, throws otherwise
   * @throws UnauthorizedException - If token is missing or invalid
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get the HTTP request from the execution context
    const request = context.switchToHttp().getRequest<Request>();

    // Extract token from Authorization header
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      /**
       * VERIFY TOKEN:
       * JwtService.verifyAsync() checks:
       * - Token signature is valid
       * - Token hasn't expired
       * - Token was signed with our secret
       */
      const payload = await this.jwtService.verifyAsync(token);

      /**
       * ATTACH USER TO REQUEST:
       * We attach the decoded payload to the request object.
       * This makes user information available in route handlers via @Req() or custom decorators.
       * 
       * TypeScript note: We're extending the Request type to include 'user'.
       * In production, create a custom type: interface RequestWithUser extends Request { user: any }
       */
      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Allow the request to proceed
    return true;
  }

  /**
   * Extract JWT token from Authorization header
   * 
   * BEARER TOKEN FORMAT:
   * The Authorization header should be: "Bearer <token>"
   * We split by space and take the second part.
   * 
   * @param request - HTTP request object
   * @returns Token string or undefined
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return undefined;
    }

    // Split "Bearer token" and extract the token
    const [type, token] = authHeader.split(' ');

    return type === 'Bearer' ? token : undefined;
  }
}
