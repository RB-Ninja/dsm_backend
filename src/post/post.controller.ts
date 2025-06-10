import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/createPost.dto';
import { CreateCommentDto } from './dto/createComment.dto';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('')
  post(@Req() req, @Body() createPostDto: CreatePostDto) {
    const walletAddress = req.user.walletAddress;
    return this.postService.post(walletAddress, createPostDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('')
  getPosts(
    @Req() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const walletAddress = req.user.walletAddress;
    return this.postService.getPosts(walletAddress, page, limit);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':postId/like')
  likePost(@Req() req, @Param('postId') postId: string) {
    const walletAddress = req.user.walletAddress;
    return this.postService.like(walletAddress, parseInt(postId));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':postId/comment')
  commentPost(
    @Req() req,
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const walletAddress = req.user.walletAddress;
    return this.postService.comment(
      walletAddress,
      parseInt(postId),
      createCommentDto,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':postId')
  getPost(@Req() req, @Param('postId') postId: string) {
    return this.postService.getPost(Number(postId));
  }
}
