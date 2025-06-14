import { Body, Controller, Post } from '@nestjs/common';
import { VerifyWalletDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verify')
  verifyWallet(@Body() dto: VerifyWalletDto) {
    return this.authService.verifyWallet(dto);
  }
}
