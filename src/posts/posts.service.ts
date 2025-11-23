import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

/**
 * PostsService - Business Logic Layer for Post Operations
 * 
 * SEPARATION OF CONCERNS:
 * This service handles all post-related business logic, keeping controllers thin.
 * Controllers handle HTTP concerns, services handle business logic.
 */
@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * Create a new post
   * 
   * RELATIONAL DATA CREATION:
   * When creating a post, we link it to an existing user via authorId.
   * Prisma automatically handles the foreign key relationship.
   * 
   * @param createPostDto - Post creation data
   * @returns Promise<Post> - The newly created post
   */
  async create(createPostDto: CreatePostDto) {
    return this.prisma.post.create({
      data: createPostDto,
      /**
       * EAGER LOADING:
       * We include the author data in the response using Prisma's 'include'.
       * This prevents N+1 query problems by fetching related data in a single query.
       */
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Retrieve all posts
   * 
   * QUERY OPTIMIZATION:
   * We include related data (author, comments count, likes count) to provide
   * a complete view of each post without requiring additional API calls.
   * 
   * @returns Promise<Post[]> - Array of all posts with related data
   */
  async findAll() {
    return this.prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        /**
         * AGGREGATION:
         * _count gives us the number of related records without fetching them all.
         * This is efficient for displaying counts (e.g., "5 comments, 12 likes").
         */
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
      /**
       * SORTING:
       * Order posts by creation date, newest first.
       * This is a common pattern for blog/social media applications.
       */
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Retrieve a single post by ID
   * 
   * DETAILED VIEW:
   * For a single post, we include more detailed information including
   * actual comments and likes, not just counts.
   * 
   * @param id - Post ID
   * @returns Promise<Post> - The found post with full details
   * @throws NotFoundException - If post doesn't exist
   */
  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        likes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  /**
   * Update a post
   * 
   * AUTHORIZATION CONSIDERATION:
   * In a real application, you'd verify that the user updating the post
   * is the author or has admin privileges. This would typically be done
   * using Guards (e.g., @UseGuards(AuthGuard, OwnershipGuard)).
   * 
   * @param id - Post ID
   * @param updatePostDto - Partial post data
   * @returns Promise<Post> - The updated post
   * @throws NotFoundException - If post doesn't exist
   */
  async update(id: number, updatePostDto: UpdatePostDto) {
    // Verify post exists
    await this.findOne(id);

    return this.prisma.post.update({
      where: { id },
      data: updatePostDto,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Delete a post
   * 
   * CASCADE DELETION:
   * Depending on your schema configuration, deleting a post might also
   * delete associated comments and likes (CASCADE), or prevent deletion
   * if there are related records (RESTRICT).
   * 
   * @param id - Post ID
   * @returns Promise<Post> - The deleted post
   * @throws NotFoundException - If post doesn't exist
   */
  async remove(id: number) {
    // Verify post exists
    await this.findOne(id);

    return this.prisma.post.delete({
      where: { id },
    });
  }
}
