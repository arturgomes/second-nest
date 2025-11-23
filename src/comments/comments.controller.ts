import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

/**
 * CommentsController - HTTP Request Handler for Comment Operations
 * 
 * RESOURCE-ORIENTED DESIGN:
 * Comments can be accessed in two ways:
 * 1. As a standalone resource: /comments/:id
 * 2. As a nested resource: /posts/:postId/comments (could be implemented)
 * 
 * We're using approach #1 for simplicity, but approach #2 is also valid.
 */
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  /**
   * POST /comments - Create a new comment
   * 
   * @param createCommentDto - Comment creation data
   * @returns Promise<Comment> - The created comment (201 Created)
   */
  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  /**
   * GET /comments?postId=123 - Get comments for a specific post
   * 
   * QUERY PARAMETERS:
   * @Query() decorator extracts query string parameters.
   * Example: GET /comments?postId=5
   * 
   * ALTERNATIVE DESIGN:
   * You could also implement this as GET /posts/:postId/comments
   * using nested routes. Both approaches are valid.
   * 
   * @param postId - Post ID from query parameter
   * @returns Promise<Comment[]> - Array of comments for the post
   */
  @Get()
  findByPost(@Query('postId', ParseIntPipe) postId: number) {
    return this.commentsService.findByPost(postId);
  }

  /**
   * GET /comments/:id - Get a specific comment
   * 
   * @param id - Comment ID from URL parameter
   * @returns Promise<Comment> - The found comment (200 OK)
   * @throws NotFoundException - If comment doesn't exist (404)
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.findOne(id);
  }

  /**
   * DELETE /comments/:id - Delete a comment
   * 
   * MODERATION:
   * In a real application, you'd want to implement:
   * 1. Authentication to verify the user's identity
   * 2. Authorization to verify the user can delete this comment
   * 3. Possibly soft delete instead of hard delete for audit trails
   * 
   * @param id - Comment ID from URL parameter
   * @returns Promise<Comment> - The deleted comment (200 OK)
   * @throws NotFoundException - If comment doesn't exist (404)
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.remove(id);
  }
}
