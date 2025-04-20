import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from '../services/posts.service';
import { JwtAuthGuard } from '../../auth/common/guards/jwt-auth.guard';
import { NotFoundException } from '@nestjs/common';

describe('PostsController', () => {
  let controller: PostsController;
  let postsService: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: {
            create: jest.fn(),
            findByUser: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findAllPublicPosts: jest.fn(),
            findById: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PostsController>(PostsController);
    postsService = module.get<PostsService>(PostsService);
  });

  describe('getOne', () => {
    it('should throw NotFound if post is unpublished', async () => {
      jest.spyOn(postsService, 'findById').mockResolvedValue({ isPublished: false } as any);
      await expect(controller.findOne('postId')).rejects.toThrow(NotFoundException);
    });
  });

  // Additional tests for other endpoints...
});