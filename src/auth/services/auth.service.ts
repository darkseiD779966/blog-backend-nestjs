import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../../users/repositories/user.repository';
import { AuthProvider } from '../constants/authProvider';





@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService
  ) {}

  async validateOAuthLogin(oauthUser: { email: string; name: string; provider: AuthProvider }): Promise<string> {
    let user = await this.usersRepository.findByEmail(oauthUser.email);

    if (!user) {
      user = await this.usersRepository.create({
        email: oauthUser.email,
        name: oauthUser.name,
        provider: oauthUser.provider,
      });
    }

    const payload = { sub: user!.id.toString(), email: user!.email };


    return this.jwtService.sign(payload);
  }

  loginTestUser(userId: string) {
    const payload = { sub: userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
