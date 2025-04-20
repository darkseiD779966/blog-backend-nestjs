import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './controllers/posts.controller';
import { PostsService } from './services/posts.service';
import { PostsRepository } from './repositories/post.repository';
import { Post, PostSchema } from './schemas/post.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }])],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
  exports: [PostsService],
})
export class PostsModule {}
