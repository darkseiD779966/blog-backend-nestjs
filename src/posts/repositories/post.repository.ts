import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from '../schemas/post.schema';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {}

  async create(data: Partial<Post>): Promise<PostDocument> {
    return this.postModel.create(data);
  }

  async findByUserId(userId: string): Promise<PostDocument[]> {
    console.log('Querying with:', userId);

    return this.postModel
      .find({ authorId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<PostDocument | null> {
    return this.postModel.findById(id).exec();
  }

  async update(id: string, data: Partial<Post>): Promise<PostDocument | null> {
    return this.postModel
      .findByIdAndUpdate(id, { $set: data }, { new: true })
      .exec();
  }

  async delete(id: string): Promise<void> {
    await this.postModel.findByIdAndDelete(id).exec();
  }

  async findAllPublic(page: number = 1, limit: number = 10): Promise<{ posts: PostDocument[], totalPages: number, currentPage: number }> {
    const skip = (page - 1) * limit; // Calculate skip based on page number
    
    // Get the total number of posts to calculate totalPages
    const totalCount = await this.postModel.countDocuments({ isPublished: true });
    
    // Calculate totalPages
    const totalPages = Math.ceil(totalCount / limit);
    
    // Fetch the posts with pagination
    const posts = await this.postModel
      .find({ isPublished: true }) // Filter for published posts
      .sort({ createdAt: -1 }) // Sort by creation date in descending order
      .skip(skip) // Skip posts based on page number
      .limit(limit) // Limit results based on the provided limit
      .exec();
    
    return {
      posts,
      totalPages,
      currentPage: page,
    };
  }
  
}
