import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

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
   * VALIDATION PIPELINE:
   * 1. NestJS receives the request
   * 2. @Body() decorator extracts the request body
   * 3. ValidationPipe validates against CreatePostDto
   * 4. If validation passes, the method executes
   * 5. If validation fails, a 400 Bad Request is returned automatically
   * 
   * @param createPostDto - Validated post creation data
   * @returns Promise<Post> - The created post (201 Created)
   */
  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  /**
   * GET /posts - Retrieve all posts
   * 
   * RESPONSE STRUCTURE:
   * Returns an array of posts with author info and counts.
   * This provides enough data for a list view without over-fetching.
   * 
   * @returns Promise<Post[]> - Array of posts (200 OK)
   */
  @Get()
  findAll() {
    return this.postsService.findAll();
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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  /**
   * PATCH /posts/:id - Update a post
   * 
   * PARTIAL UPDATES:
   * Only the fields provided in the request body will be updated.
   * This is more flexible than PUT, which typically requires the full object.
   * 
   * @param id - Post ID from URL parameter
   * @param updatePostDto - Partial post data
   * @returns Promise<Post> - The updated post (200 OK)
   * @throws NotFoundException - If post doesn't exist (404)
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(id, updatePostDto);
  }

  /**
   * DELETE /posts/:id - Delete a post
   * 
   * IDEMPOTENCY:
   * DELETE should be idempotent - calling it multiple times should have
   * the same effect as calling it once. Our implementation throws 404
   * on subsequent calls, which is acceptable.
   * 
   * @param id - Post ID from URL parameter
   * @returns Promise<Post> - The deleted post (200 OK)
   * @throws NotFoundException - If post doesn't exist (404)
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.remove(id);
  }
}
