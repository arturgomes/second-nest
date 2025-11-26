import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { AuthModule } from './auth/auth.module';

import { CsvImportModule } from './csv-import/csv-import.module';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, PostsModule, CommentsModule, LikesModule, AuthModule, CsvImportModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
