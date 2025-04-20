import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { PostsRepository } from '../repositories/post.repository';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostDocument } from '../schemas/post.schema';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  create(userId: string, dto: CreatePostDto) {
    // Convert string userId to a Mongo ObjectId
    const authorObjectId = new Types.ObjectId(userId);

    return this.postsRepository.create({
      ...dto,
      authorId: authorObjectId, // now matches Types.ObjectId
    });
  }

  findByUser(userId: string) {
    return this.postsRepository.findByUserId(userId);
  }

  findById(id: string) {
    return this.postsRepository.findById(id);
  }

  async update(userId: string, postId: string, dto: UpdatePostDto) {
    const post = await this.postsRepository.findById(postId);
    if (!post) throw new NotFoundException('Post not found');
    if (post.authorId.toString() !== userId) throw new ForbiddenException();
    return this.postsRepository.update(postId, dto);
  }

  async delete(userId: string, postId: string) {
    const post = await this.postsRepository.findById(postId);
    if (!post) throw new NotFoundException();
    if (post.authorId.toString() !== userId) throw new ForbiddenException();
    return this.postsRepository.delete(postId);
  }

  async findAllPublicPosts(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    posts: PostDocument[];
    totalPages: number;
    currentPage: number;
  }> {
    return this.postsRepository.findAllPublic(page, limit);
  }
}
