import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/createPost.dto';
import { CreateCommentDto } from './dto/createComment.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async post(walletAddress: string, createPostDto: CreatePostDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { walletAddress: walletAddress },
    });

    if (!existingUser) {
      throw new NotFoundException(`User not found.`);
    }

    const createPost = await this.prisma.post.create({
      data: {
        content: createPostDto.content,
        user: {
          connect: {
            walletAddress: walletAddress,
          },
        },
      },
    });

    return {
      success: true,
      statusCode: 200,
      data: createPost,
    };
  }

  async getPosts(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        skip,
        take: limit,
        orderBy: {
          timestamp: 'desc',
        },
        include: {
          user: {
            select: {
              walletAddress: true,
              username: true,
            },
          },
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
        },
      }),
      this.prisma.post.count(),
    ]);

    return {
      success: true,
      statusCode: 200,
      data: {
        posts: posts.map(post => ({
          ...post,
          commentCount: post._count.comments,
          likeCount: post._count.likes,
          _count: undefined,
        })),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async getPost(postId: number) {
    const getPost = await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            walletAddress: true,
            username: true,
            timestamp: true,
          },
        },
        likes: {
          select: {
            walletAddress: true,
            timestamp: true,
          },
        },
        comments: {
          select: {
            walletAddress: true,
            content: true,
            timestamp: true,
          },
        },
      },
    });

    if (!getPost) {
      throw new NotFoundException(`Post with ID ${postId} not found.`);
    }

    return {
      success: true,
      statusCode: 200,
      data: getPost,
    };
  }

  async like(walletAddress: string, postId: number) {
    // Check if post exists
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found.`);
    }

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { walletAddress: walletAddress },
    });

    if (!user) {
      throw new NotFoundException(`User not found.`);
    }

    // Check if like already exists
    const existingLike = await this.prisma.like.findUnique({
      where: {
        postId_walletAddress: {
          postId: postId,
          walletAddress: walletAddress,
        },
      },
    });

    let result;
    if (existingLike) {
      // If like exists, remove it (dislike)
      result = await this.prisma.like.delete({
        where: {
          postId_walletAddress: {
            postId: postId,
            walletAddress: walletAddress,
          },
        },
        include: {
          post: {
            select: {
              id: true,
              content: true,
              timestamp: true,
            },
          },
          user: {
            select: {
              walletAddress: true,
              username: true,
            },
          },
        },
      });
    } else {
      // If like doesn't exist, create it
      result = await this.prisma.like.create({
        data: {
          post: {
            connect: {
              id: postId,
            },
          },
          user: {
            connect: {
              walletAddress: walletAddress,
            },
          },
        },
        include: {
          post: {
            select: {
              id: true,
              content: true,
              timestamp: true,
            },
          },
          user: {
            select: {
              walletAddress: true,
              username: true,
            },
          },
        },
      });
    }

    return {
      success: true,
      statusCode: 200,
      data: {
        ...result,
        action: existingLike ? 'disliked' : 'liked',
      },
    };
  }

  async comment(
    walletAddress: string,
    postId: number,
    createCommentDto: CreateCommentDto,
  ) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found.`);
    }

    const user = await this.prisma.user.findUnique({
      where: { walletAddress: walletAddress },
    });

    if (!user) {
      throw new NotFoundException(`User not found.`);
    }

    const createComment = await this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        post: {
          connect: {
            id: postId,
          },
        },
        user: {
          connect: {
            walletAddress: walletAddress,
          },
        },
      },
      include: {
        post: {
          select: {
            id: true,
            content: true,
            timestamp: true,
          },
        },
        user: {
          select: {
            walletAddress: true,
            username: true,
          },
        },
      },
    });

    return {
      success: true,
      statusCode: 200,
      data: createComment,
    };
  }
}
