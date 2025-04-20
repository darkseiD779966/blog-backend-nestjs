// src/scripts/post.seeder.ts
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import { PostSchema } from '../posts/schemas/post.schema';
import { model, connect } from 'mongoose';

const Post = model('Post', PostSchema);

// 🔥 Hardcoded Mongo URI
const MONGO_URI = 'mongodb+srv://sofafasa0:4tkBSxjT9O3oKSaB@cluster0.m0dim8g.mongodb.net/';

async function seedPosts() {
  await connect(MONGO_URI, { dbName: 'blog' }); // dbName must match AppModule
  console.log('✅ Connected to MongoDB');

  const authorIds = Array.from(
    { length: 100 },
    () => new mongoose.Types.ObjectId(),
  );

  const BATCH_SIZE = 1000;
  const TOTAL_POSTS = 100000;

  for (let i = 0; i < TOTAL_POSTS / BATCH_SIZE; i++) {
    const batch = Array.from({ length: BATCH_SIZE }, () => ({
      title: faker.lorem.sentence(),
      body: faker.lorem.paragraphs(3),
      authorId: faker.helpers.arrayElement(authorIds),
      coverImageUrl: faker.image.url(),
      isPublished: faker.datatype.boolean(),
    }));

    await Post.insertMany(batch);
    console.log(`Inserted batch ${i + 1}/${TOTAL_POSTS / BATCH_SIZE}`);
  }

  console.log('🌱 Seeding complete!');
  process.exit(0);
}

seedPosts().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
