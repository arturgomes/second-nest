import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/dto/paginated-response.dto';

/**
 * CommentsService - Business Logic Layer for Comment Operations
 * 
 * FOCUSED RESPONSIBILITY:
 * This service handles comment-specific operations.
 * Comments are simpler than posts - they're typically create and delete only.
 */
@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * Create a new comment
   * 
   * VALIDATION CONSIDERATIONS:
   * In production, you should verify:
   * 1. The post exists (we rely on database foreign key constraint here)
   * 2. The user exists (same as above)
   * 3. The user is authenticated (would use Guards)
   * 
   * @param createCommentDto - Comment creation data
   * @returns Promise<Comment> - The newly created comment
   */
  async create(createCommentDto: CreateCommentDto) {
    return this.prisma.comment.create({
      data: createCommentDto,
      include: {
        author: {
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
  }

  /**
   * Retrieve all comments for a specific post with pagination
   * 
   * QUERY FILTERING + PAGINATION:
   * We filter by postId and apply pagination.
   * This is useful for displaying comments on a post detail page.
   * 
   * @param postId - The post to get comments for
   * @param paginationDto - Pagination parameters
   * @returns Promise<PaginatedResponse<Comment>> - Paginated comments for the post
   */
  async findByPost(postId: string, paginationDto: PaginationDto) {
    const { skip, limit = 10 } = paginationDto;

    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: { postId },
        skip,
        take: limit,
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
      }),
      this.prisma.comment.count({ where: { postId } }),
    ]);

    return new PaginatedResponse(comments, total, paginationDto.page ?? 1, limit);
  }

  /**
   * Retrieve a single comment by ID
   * 
   * @param id - Comment ID
   * @returns Promise<Comment> - The found comment
   * @throws NotFoundException - If comment doesn't exist
   */
  async findOne(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        author: {
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

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return comment;
  }

  /**
   * Delete a comment
   * 
   * AUTHORIZATION:
   * In production, verify that the user deleting the comment is either:
   * 1. The comment author
   * 2. The post author
   * 3. An admin/moderator
   * 
   * @param id - Comment ID
   * @returns Promise<Comment> - The deleted comment
   * @throws NotFoundException - If comment doesn't exist
   */
  async remove(id: string) {
    // Verify comment exists
    await this.findOne(id);

    return this.prisma.comment.delete({
      where: { id },
    });
  }
}
