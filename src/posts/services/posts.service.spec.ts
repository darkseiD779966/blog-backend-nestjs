import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { PostsRepository } from '../repositories/post.repository';
import { Types } from 'mongoose';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('PostsService', () => {
  let service: PostsService;
  let postsRepository: PostsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PostsRepository,
          useValue: {
            create: jest.fn(),
            findByUserId: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findAllPublic: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    postsRepository = module.get<PostsRepository>(PostsRepository);
  });

  describe('create', () => {
    it('should convert userId to ObjectId and call repository', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const dto = { title: 'Test', body: 'Content' , isPublished: true};
      await service.create(userId, dto);
      expect(postsRepository.create).toHaveBeenCalledWith({
        ...dto,
        authorId: new Types.ObjectId(userId),
      });
    });
  });

  describe('update', () => {
    it('should throw ForbiddenException if user is not the author', async () => {
      const post = { authorId: new Types.ObjectId() };
      jest.spyOn(postsRepository, 'findById').mockResolvedValue(post as any);
      await expect(
        service.update('anotherUserId', 'postId', {}),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // Additional tests for other methods...
});