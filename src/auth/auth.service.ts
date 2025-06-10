import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { VerifyWalletDto } from './dto/auth.dto';
import { verifyMessage } from 'ethers';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async verifyWallet(dto: VerifyWalletDto) {
    const { message, signature } = dto;

    let recoveredAddress: string;
    try {
      recoveredAddress = verifyMessage(message, signature);
    } catch {
      throw new UnauthorizedException('Invalid signature');
    }

    let user = await this.prisma.user.findUnique({
      where: { walletAddress: recoveredAddress },
    });

    if (!user) {
      const defaultUsername = `user_${recoveredAddress.slice(0, 6)}`;
      user = await this.prisma.user.create({
        data: {
          walletAddress: recoveredAddress,
          username: defaultUsername,
          bio: null,
          profilePicUrl: null,
        },
      });
    }

    const token = this.jwtService.sign({ walletAddress: user.walletAddress });
    return {
      success: true,
      statusCode: 200,
      data: token,
    };
  }
}
