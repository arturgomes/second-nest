import { IsString, IsNotEmpty, IsInt } from 'class-validator';

/**
 * Data Transfer Object for creating a comment.
 * 
 * SIMPLIFIED DTO:
 * Unlike posts, comments typically don't need update functionality.
 * Users usually can't edit comments after posting (or we'd add a separate UpdateCommentDto).
 * This keeps the API simple and prevents comment manipulation.
 */
export class CreateCommentDto {
  @IsString()
  @IsNotEmpty({ message: 'Comment content is required' })
  content: string;

  /**
   * Post ID - Foreign Key Reference
   * This links the comment to a specific post.
   */
  @IsInt({ message: 'Post ID must be a valid integer' })
  @IsNotEmpty({ message: 'Post ID is required' })
  postId: number;

  /**
   * Author ID - Foreign Key Reference
   * This identifies who wrote the comment.
   * In a real app with authentication, this would come from the JWT token,
   * not from the request body (to prevent impersonation).
   */
  @IsInt({ message: 'Author ID must be a valid integer' })
  @IsNotEmpty({ message: 'Author ID is required' })
  authorId: number;
}
