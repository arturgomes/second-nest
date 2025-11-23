import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException } from '@nestjs/common';

/**
 * PostsService Unit Tests
 * 
 * RELATIONAL DATA TESTING:
 * These tests verify operations on posts including:
 * - Creating posts with author relationships
 * - Fetching posts with eager-loaded data
 * - Pagination
 * - Update and delete operations
 */
describe('PostsService', () => {
  let service: PostsService;
  let prisma: PrismaService;

  const mockPost = {
    id: 1,
    title: 'Test Post',
    content: 'Test content',
    published: false,
    authorId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    author: {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
    },
    _count: {
      comments: 5,
      likes: 10,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PrismaService,
          useValue: {
            post: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a post with author relationship', async () => {
      const createPostDto = {
        title: 'New Post',
        content: 'Content',
        authorId: 1,
        published: false,
      };

      jest.spyOn(prisma.post, 'create').mockResolvedValue(mockPost as any);

      const result = await service.create(createPostDto);

      expect(result).toBeDefined();
      expect(result.author).toBeDefined();
      expect(prisma.post.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: createPostDto,
          include: expect.objectContaining({
            author: expect.any(Object),
          }),
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated posts with counts', async () => {
      const paginationDto = { page: 1, limit: 10, skip: 0 };

      jest.spyOn(prisma.post, 'findMany').mockResolvedValue([mockPost] as any);
      jest.spyOn(prisma.post, 'count').mockResolvedValue(1);

      const result = await service.findAll(paginationDto);

      expect(result.data).toHaveLength(1);
      expect(result.data[0]._count).toBeDefined();
      expect(result.meta.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return post with full details', async () => {
      const postWithDetails = {
        ...mockPost,
        comments: [],
        likes: [],
      };

      jest
        .spyOn(prisma.post, 'findUnique')
        .mockResolvedValue(postWithDetails as any);

      const result = await service.findOne(1);

      expect(result).toBeDefined();
      expect(result.comments).toBeDefined();
      expect(result.likes).toBeDefined();
    });

    it('should throw NotFoundException if post not found', async () => {
      jest.spyOn(prisma.post, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const updateDto = { title: 'Updated Title' };
      const postWithDetails = {
        ...mockPost,
        comments: [],
        likes: [],
      };

      jest
        .spyOn(prisma.post, 'findUnique')
        .mockResolvedValue(postWithDetails as any);
      jest.spyOn(prisma.post, 'update').mockResolvedValue({
        ...mockPost,
        ...updateDto,
      } as any);

      const result = await service.update(1, updateDto);

      expect(result.title).toBe('Updated Title');
    });
  });

  describe('remove', () => {
    it('should delete a post', async () => {
      const postWithDetails = {
        ...mockPost,
        comments: [],
        likes: [],
      };

      jest
        .spyOn(prisma.post, 'findUnique')
        .mockResolvedValue(postWithDetails as any);
      jest.spyOn(prisma.post, 'delete').mockResolvedValue(mockPost as any);

      const result = await service.remove(1);

      expect(result).toBeDefined();
      expect(prisma.post.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});
