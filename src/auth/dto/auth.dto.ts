import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyWalletDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  signature: string;
}
