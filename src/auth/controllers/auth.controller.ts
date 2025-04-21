import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/test-login')
  testLogin(@Body() dto: { userId: string }) {
    // Bypass Facebook auth, directly generate JWT
    return this.authService.loginTestUser(dto.userId);
  }

  @Get('google')
  @ApiOperation({ summary: 'Redirect to Google OAuth2 login' })
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    return;
  }

  @Get('google/callback')
  @ApiOperation({ summary: 'Google OAuth2 callback' })
  @ApiResponse({ status: 302, description: 'Redirects to frontend with token' })
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const jwt = await this.authService.validateOAuthLogin(req.user);
    // Send token to frontend (or set cookie)
    return res.redirect(`http://localhost:4200/auth/callback/?token=${jwt}`);
  }

  @Get('facebook')
  @ApiOperation({ summary: 'Redirect to Facebook OAuth2 login' })
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth() {
    return;
  }

  @Get('facebook/callback')
  @ApiOperation({ summary: 'Facebook OAuth2 callback' })
  @ApiResponse({ status: 302, description: 'Redirects to frontend with token' })
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthRedirect(@Req() req, @Res() res) {
    const jwt = await this.authService.validateOAuthLogin(req.user);
    return res.redirect(`http://localhost:4200/auth/callback?token=${jwt}`);
  }
}
