import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OwnershipGuard } from '../auth/guards/ownership.guard';

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
   * AUTHENTICATION REQUIRED:
   * Users must be authenticated to create comments.
   * 
   * @param createCommentDto - Comment creation data
   * @returns Promise<Comment> - The created comment (201 Created)
   */
  @UseGuards(JwtAuthGuard)
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
   * AUTHENTICATION + AUTHORIZATION:
   * Users must be authenticated and own the comment to delete it.
   * 
   * @param id - Comment ID from URL parameter
   * @returns Promise<Comment> - The deleted comment (200 OK)
   * @throws UnauthorizedException - If not authenticated (401)
   * @throws ForbiddenException - If user doesn't own the comment (403)
   * @throws NotFoundException - If comment doesn't exist (404)
   */
  @UseGuards(JwtAuthGuard, OwnershipGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.remove(id);
  }
}
