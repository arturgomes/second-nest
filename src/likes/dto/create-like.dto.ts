import { IsInt, IsNotEmpty } from 'class-validator';

/**
 * Data Transfer Object for creating/toggling a like.
 * 
 * SIMPLIFIED STRUCTURE:
 * Likes are binary - they either exist or they don't.
 * There's no content, no timestamps to update, just the relationship.
 */
export class CreateLikeDto {
  /**
   * Post ID - The post being liked
   */
  @IsInt({ message: 'Post ID must be a valid integer' })
  @IsNotEmpty({ message: 'Post ID is required' })
  postId: number;

  /**
   * User ID - The user who is liking the post
   * 
   * SECURITY NOTE:
   * In a real application with authentication, this would come from
   * the authenticated user's session/JWT token, not from the request body.
   * Accepting it from the body allows users to like on behalf of others.
   */
  @IsInt({ message: 'User ID must be a valid integer' })
  @IsNotEmpty({ message: 'User ID is required' })
  userId: number;
}
