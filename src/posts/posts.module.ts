import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaService } from '../prisma.service';

/**
 * PostsModule - Feature Module for Post Management
 * 
 * MODULE ORGANIZATION:
 * Each feature module encapsulates related functionality.
 * This makes the codebase easier to navigate and maintain.
 */
@Module({
  controllers: [PostsController],
  providers: [PostsService, PrismaService],
  /**
   * EXPORTS:
   * We export PostsService so other modules (like Comments) can use it.
   * For example, CommentsService might need to verify that a post exists
   * before allowing a comment to be created.
   */
  exports: [PostsService],
})
export class PostsModule { }
