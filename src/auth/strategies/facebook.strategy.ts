import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    const options: StrategyOptions = {
      clientID: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      callbackURL: 'https://d290-2406-b400-b1-fd2f-f1fb-719d-cf8-790c.ngrok-free.app/auth/facebook/callback',
      profileFields: ['id', 'emails', 'name', 'displayName'],
      scope: ['email'],
    };

    super(options);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ): Promise<any> {
    const { name, emails } = profile;
    const user = {
      email: emails?.[0]?.value,
      name: name?.givenName + ' ' + name?.familyName,
      provider: 'facebook',
    };
    done(null, user);
  }
}
