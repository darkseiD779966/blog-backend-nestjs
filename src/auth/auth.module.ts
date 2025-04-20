// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { FacebookStrategy } from './strategies/facebook.strategy';

@Module({
  imports: [
    // ensure ConfigService is available here
    ConfigModule,

    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const secret = cfg.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET must be defined in .env');
        }
        return {
          secret,
          signOptions: { expiresIn: '1d' },
        };
      },
    }),

    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, JwtStrategy, FacebookStrategy],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
