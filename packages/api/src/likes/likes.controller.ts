import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';

/**
 * LikesController - HTTP Request Handler for Like Operations
 * 
 * TOGGLE-BASED API:
 * Instead of separate POST and DELETE endpoints, we use a single
 * POST endpoint that toggles the like state. This is more intuitive
 * for the frontend - one button, one API call.
 */
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) { }

  /**
   * POST /likes/toggle - Toggle a like on a post
   * 
   * TOGGLE SEMANTICS:
   * - If the user hasn't liked the post, it creates a like
   * - If the user has already liked the post, it removes the like
   * 
   * RESPONSE FORMAT:
   * Returns an object with:
   * - action: 'liked' or 'unliked'
   * - like: the like object
   * 
   * This tells the frontend what happened, so it can update the UI accordingly.
   * 
   * @param createLikeDto - Contains postId and userId
   * @returns Object indicating the action taken and the like data
   */
  @Post('toggle')
  toggle(@Body() createLikeDto: CreateLikeDto) {
    return this.likesService.toggle(createLikeDto);
  }

  /**
   * GET /likes/post?postId=123 - Get all likes for a post
   * 
   * QUERY PARAMETER USAGE:
   * We use query parameters instead of path parameters here to keep
   * the URL structure clean and RESTful.
   * 
   * @param postId - Post ID from query parameter
   * @returns Promise<Like[]> - Array of likes for the post
   */
  @Get('post')
  findByPost(@Query('postId', ParseIntPipe) postId: number) {
    return this.likesService.findByPost(postId);
  }

  /**
   * GET /likes/user?userId=456 - Get all posts liked by a user
   * 
   * @param userId - User ID from query parameter
   * @returns Promise<Like[]> - Array of likes by the user
   */
  @Get('user')
  findByUser(@Query('userId', ParseIntPipe) userId: number) {
    return this.likesService.findByUser(userId);
  }

  /**
   * GET /likes/check?postId=123&userId=456 - Check if a user has liked a post
   * 
   * UTILITY ENDPOINT:
   * This is useful for the frontend to determine the initial state
   * of the like button when loading a post.
   * 
   * MULTIPLE QUERY PARAMETERS:
   * We can extract multiple parameters using multiple @Query() decorators.
   * 
   * @param postId - Post ID from query parameter
   * @param userId - User ID from query parameter
   * @returns Object with hasLiked boolean
   */
  @Get('check')
  async checkLike(
    @Query('postId', ParseIntPipe) postId: number,
    @Query('userId', ParseIntPipe) userId: number,
  ) {
    const hasLiked = await this.likesService.hasUserLikedPost(postId, userId);
    return { hasLiked };
  }
}
