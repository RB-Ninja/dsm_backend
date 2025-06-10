import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';

@Module({
  controllers: [AppController, UserController],
  providers: [AppService, PrismaService, UserService],
  imports: [UserModule, PostModule, AuthModule],
})
export class AppModule {}
