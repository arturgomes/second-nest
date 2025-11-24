import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OwnershipGuard } from '../auth/guards/ownership.guard';
import { PaginationDto } from '../common/dto/pagination.dto';

/**
 * PostsController - HTTP Request Handler for Post Operations
 * 
 * RESTful API DESIGN:
 * This controller follows REST conventions:
 * - GET /posts - List all posts
 * - GET /posts/:id - Get a specific post
 * - POST /posts - Create a new post
 * - PATCH /posts/:id - Update a post
 * - DELETE /posts/:id - Delete a post
 */
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  /**
   * POST /posts - Create a new post
   * 
   * AUTHENTICATION REQUIRED:
   * @UseGuards(JwtAuthGuard) protects this endpoint.
   * Users must include a valid JWT token in the Authorization header.
   * 
   * VALIDATION PIPELINE:
   * 1. JwtAuthGuard verifies the token
   * 2. @Body() decorator extracts the request body
   * 3. ValidationPipe validates against CreatePostDto
   * 4. If all checks pass, the method executes
   * 
   * @param createPostDto - Validated post creation data
   * @returns Promise<Post> - The created post (201 Created)
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  /**
   * GET /posts - Retrieve all posts with pagination
   * 
   * RESPONSE STRUCTURE:
   * Returns paginated posts with author info and counts.
   * 
   * @param paginationDto - Pagination parameters from query string
   * @returns Promise<PaginatedResponse<Post>> - Paginated posts (200 OK)
   */
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.postsService.findAll(paginationDto);
  }

  /**
   * GET /posts/:id - Retrieve a specific post
   * 
   * DETAILED RESPONSE:
   * Returns full post details including comments and likes.
   * This is suitable for a detailed post view page.
   * 
   * @param id - Post ID from URL parameter
   * @returns Promise<Post> - The found post (200 OK)
   * @throws NotFoundException - If post doesn't exist (404)
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  /**
   * PATCH /posts/:id - Update a post
   * 
   * AUTHENTICATION + AUTHORIZATION:
   * @UseGuards(JwtAuthGuard, OwnershipGuard) ensures:
   * 1. User is authenticated (has valid token)
   * 2. User owns the post they're trying to update
   * 
   * GUARD ORDER MATTERS:
   * JwtAuthGuard must run first to authenticate the user,
   * then OwnershipGuard can check if they own the resource.
   * 
   * @param id - Post ID from URL parameter
   * @param updatePostDto - Partial post data
   * @returns Promise<Post> - The updated post (200 OK)
   * @throws UnauthorizedException - If not authenticated (401)
   * @throws ForbiddenException - If user doesn't own the post (403)
   * @throws NotFoundException - If post doesn't exist (404)
   */
  @UseGuards(JwtAuthGuard, OwnershipGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(id, updatePostDto);
  }

  /**
   * DELETE /posts/:id - Delete a post
   * 
   * AUTHENTICATION + AUTHORIZATION:
   * Same as update - user must be authenticated and own the post.
   * 
   * @param id - Post ID from URL parameter
   * @returns Promise<Post> - The deleted post (200 OK)
   * @throws UnauthorizedException - If not authenticated (401)
   * @throws ForbiddenException - If user doesn't own the post (403)
   * @throws NotFoundException - If post doesn't exist (404)
   */
  @UseGuards(JwtAuthGuard, OwnershipGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }

  @UseGuards(JwtAuthGuard, OwnershipGuard)
  @Patch(':id/publish')
  publish(@Param('id') id: string) {
    return this.postsService.publish(id);
  }
}
