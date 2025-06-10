import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsString()
  @IsOptional()
  bio: string;

  @IsString()
  @IsOptional()
  profilePicUrl: string;
}
