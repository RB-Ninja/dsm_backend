import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Patch('')
  update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const walletAddress = req.user.walletAddress;
    return this.userService.updateUser(walletAddress, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('')
  get(@Req() req) {
    const walletAddress = req.user.walletAddress;
    return this.userService.getUser(walletAddress);
  }
}
