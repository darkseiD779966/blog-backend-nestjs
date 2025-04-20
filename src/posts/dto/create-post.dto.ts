// src/posts/dto/create-post.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'My first blog post', description: 'Title of the post' })
  title: string;

  @ApiProperty({ example: 'This is the content of the post.', description: 'Main content' })
  body: string;

  @ApiProperty({ example: 'https://example.com/image.png', required: false, description: 'Cover image URL' })
  coverImageUrl?: string;

  @ApiProperty({ example: true, description: 'Is the post published?' })
  isPublished: boolean;
}
