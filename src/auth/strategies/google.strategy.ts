import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: 'http://localhost:3000/auth/google/callback',
      scope: ['profile', 'email'],
    });
  }

  authorizationParams(): Record<string, string> {
    return {
      prompt: 'select_account',        // Force account selection
      access_type: 'offline',          // Get refresh token
      response_type: 'code',
    };
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function): Promise<any> {
    const { name, emails } = profile;
    const user = {
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
      provider: 'google',
    };
    done(null, user);
  }
}
