// src/posts/dto/update-post.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiPropertyOptional({
    example: 'Updated title',
    description: 'Updated post title',
  })
  title?: string;

  @ApiPropertyOptional({
    example: 'Updated content',
    description: 'Updated post content',
  })
  body?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/new-image.png',
    description: 'Updated cover image',
  })
  coverImageUrl?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the post is published',
  })
  isPublished?: boolean;
}
