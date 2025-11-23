import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateLikeDto } from './dto/create-like.dto';

/**
 * LikesService - Business Logic Layer for Like Operations
 * 
 * TOGGLE PATTERN:
 * Unlike other resources, likes typically use a "toggle" pattern:
 * - If the like exists, remove it (unlike)
 * - If the like doesn't exist, create it (like)
 * 
 * This provides a better user experience than separate like/unlike endpoints.
 */
@Injectable()
export class LikesService {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * Toggle a like on a post
   * 
   * IDEMPOTENT OPERATION:
   * This method is idempotent - calling it multiple times has the same effect.
   * It either creates or deletes a like based on current state.
   * 
   * UNIQUE CONSTRAINT:
   * Our schema has a unique constraint on (postId, userId), ensuring
   * a user can only like a post once. This prevents duplicate likes.
   * 
   * @param createLikeDto - Contains postId and userId
   * @returns Object with action ('liked' or 'unliked') and the like data
   */
  async toggle(createLikeDto: CreateLikeDto) {
    const { postId, userId } = createLikeDto;

    // Check if the like already exists
    const existingLike = await this.prisma.like.findFirst({
      where: {
        postId,
        userId,
      },
    });

    if (existingLike) {
      // Like exists, so remove it (unlike)
      await this.prisma.like.delete({
        where: { id: existingLike.id },
      });

      return {
        action: 'unliked',
        like: existingLike,
      };
    } else {
      // Like doesn't exist, so create it
      const newLike = await this.prisma.like.create({
        data: createLikeDto,
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          post: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      return {
        action: 'liked',
        like: newLike,
      };
    }
  }

  /**
   * Get all likes for a specific post
   * 
   * AGGREGATION USE CASE:
   * This is useful for displaying who liked a post.
   * For just the count, you can use Prisma's _count (as we do in PostsService).
   * 
   * @param postId - The post to get likes for
   * @returns Promise<Like[]> - Array of likes with user information
   */
  async findByPost(postId: string) {
    return this.prisma.like.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Check if a user has liked a specific post
   * 
   * UTILITY METHOD:
   * This is useful for UI state - showing whether the current user
   * has already liked a post (to display a filled vs. outlined heart icon).
   * 
   * @param postId - The post ID
   * @param userId - The user ID
   * @returns Promise<boolean> - True if the user has liked the post
   */
  async hasUserLikedPost(postId: string, userId: string): Promise<boolean> {
    const like = await this.prisma.like.findFirst({
      where: {
        postId,
        userId,
      },
    });

    return !!like; // Convert to boolean
  }

  /**
   * Get all posts liked by a specific user
   * 
   * USER PROFILE USE CASE:
   * This is useful for displaying a user's liked posts on their profile.
   * 
   * @param userId - The user ID
   * @returns Promise<Like[]> - Array of likes with post information
   */
  async findByUser(userId: string) {
    return this.prisma.like.findMany({
      where: { userId },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
