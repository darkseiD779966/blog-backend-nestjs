// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),  // loads .env first
    
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const uri = config.get<string>('MONGO_URI');
        if (!uri) {
          throw new Error('MONGO_URI is not defined in .env file');
        }
        return { uri, dbName: 'blog' };
      },
      inject: [ConfigService],
    }),

    AuthModule,
    UsersModule,
    PostsModule
  ],
})
export class AppModule {}
