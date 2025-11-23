import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../../prisma.service';

/**
 * OwnershipGuard - Authorization Guard for Resource Ownership
 * 
 * AUTHORIZATION vs AUTHENTICATION:
 * - Authentication: "Who are you?" (handled by JwtAuthGuard)
 * - Authorization: "Are you allowed to do this?" (handled by this guard)
 * 
 * PURPOSE:
 * This guard ensures that users can only modify/delete their own resources.
 * For example, a user can only edit/delete their own posts and comments.
 * 
 * USAGE:
 * Apply this guard AFTER JwtAuthGuard:
 * @UseGuards(JwtAuthGuard, OwnershipGuard)
 * 
 * LIMITATION:
 * This is a simplified implementation. In production, you might want:
 * - Role-based access control (RBAC)
 * - Attribute-based access control (ABAC)
 * - Custom decorators to specify resource type
 */
@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * canActivate - Checks if the user owns the resource
   * 
   * OWNERSHIP VERIFICATION:
   * 1. Extract user ID from JWT payload (set by JwtAuthGuard)
   * 2. Extract resource ID from route parameters
   * 3. Fetch resource from database
   * 4. Verify the resource's authorId matches the user ID
   * 
   * @param context - Execution context
   * @returns Promise<boolean> - True if user owns the resource
   * @throws ForbiddenException - If user doesn't own the resource
   * @throws NotFoundException - If resource doesn't exist
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Get user from request (set by JwtAuthGuard)
    const user = request['user'];

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Get resource ID from route parameters
    const resourceId = request.params.id;

    if (!resourceId) {
      throw new ForbiddenException('Invalid resource ID');
    }

    /**
     * DETERMINE RESOURCE TYPE:
     * We check the URL path to determine what type of resource we're checking.
     * This is a simple approach. In production, consider using:
     * - Custom decorators: @CheckOwnership('post')
     * - Metadata: @SetMetadata('resource', 'post')
     */
    const path = request.path;

    let isOwner = false;

    if (path.includes('/posts/')) {
      isOwner = await this.checkPostOwnership(resourceId, user.sub);
    } else if (path.includes('/comments/')) {
      isOwner = await this.checkCommentOwnership(resourceId, user.sub);
    } else {
      // For other resources, allow access (or implement additional checks)
      return true;
    }

    if (!isOwner) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    return true;
  }

  /**
   * Check if user owns a post
   */
  private async checkPostOwnership(postId: string, userId: string): Promise<boolean> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post.authorId === userId;
  }

  /**
   * Check if user owns a comment
   */
  private async checkCommentOwnership(commentId: string, userId: string): Promise<boolean> {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment.authorId === userId;
  }
}
