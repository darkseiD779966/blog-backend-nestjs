import {
  Controller,
  Get,
  Post as HttpPost,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  NotFoundException,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/common/guards/jwt-auth.guard';
import { PostsService } from '../services/posts.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpPost()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiBody({ type: CreatePostDto })
  create(@Req() req, @Body() dto: CreatePostDto) {
    return this.postsService.create(req.user.userId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get current user’s posts' })
  getMyPosts(@Req() req) {
    return this.postsService.findByUser(req.user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a post by ID' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiBody({ type: UpdatePostDto })
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.postsService.update(req.user.userId, id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post by ID' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  delete(@Req() req, @Param('id') id: string) {
    return this.postsService.delete(req.user.userId, id);
  }

  @Get('public')
  @ApiOperation({ summary: 'Get all published posts (public feed)' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved posts.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getPublicFeed(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const result = await this.postsService.findAllPublicPosts(page, limit);
    return {
      posts: result.posts,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a published post by ID' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  async findOne(@Param('id') id: string) {
    const post = await this.postsService.findById(id);
    if (!post || !post.isPublished) {
      throw new NotFoundException('Post not found or unpublished');
    }
    return post;
  }
}
