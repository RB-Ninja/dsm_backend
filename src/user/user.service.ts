import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updateUser(walletAddress: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { walletAddress: walletAddress },
    });

    if (!existingUser) {
      throw new NotFoundException(`User not found.`);
    }

    const updateUser = await this.prisma.user.update({
      where: { walletAddress: walletAddress },
      data: updateUserDto,
    });

    return {
      success: true,
      statusCode: 200,
      data: updateUser,
    };
  }

  async getUser(walletAddress: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { walletAddress },
    });

    if (!existingUser) {
      throw new NotFoundException(`User not found.`);
    }

    return {
      success: true,
      statusCode: 200,
      data: existingUser,
    };
  }
}
