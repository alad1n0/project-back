import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OauthDto } from './dto/oauth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('otp')
  sendCode(@Body('phone') phone: string) {
    return this.authService.sendCode(phone);
  }

  @Post('otp-verify')
  otpVerify(@Body('phone') phone: string, @Body('code') code: string) {
    return this.authService.verifyOtp(phone, code);
  }

  @Post('oauth')
  oauthLogin(@Body() oauthDto: OauthDto) {
    return this.authService.oauthLogin(oauthDto);
  }
}