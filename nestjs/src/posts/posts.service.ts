import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}
  // 포스트 등록
  async createPost(createPostDto: CreatePostDto, ownerId: string) {
    const post = await this.prisma.post.create({
      data: {
        ...createPostDto,
        writer: { connect: { id: ownerId } },
        favoriteCount: 0,
      },
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        favoriteCount: true,
        createdAt: true,
        updatedAt: true,
        writer: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });
    return post;
  }

  // 모든 게시글 조회
  async getAllPosts() {
    const posts = await this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' }, // 최신순 정렬
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        favoriteCount: true,
        createdAt: true,
        updatedAt: true,
        writer: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });
    return posts;
  }

  // 게시글 상세 조회
  async getPost(postId: string, userId: string | null) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        favoriteCount: true,
        createdAt: true,
        updatedAt: true,
        writer: {
          select: {
            id: true,
            nickname: true,
          },
        },
        // 해당 게시글을 좋아요한 사용자 목록 조회
        // 유저가 로그인하지 않은 경우 좋아요 정보를 조회하지 않음
        likes: userId ? { where: { userId } } : false,
      },
    });

    // 게시글이 없을 경우 예외 처리
    if (!post) throw new NotFoundException('게시글을 찾을 수 없습니다.');

    // 해당 유저가 해당 게시글에 좋아요 했는지 확인
    const isLiked = userId ? post.likes.length > 0 : false;

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      image: post.image ?? null,
      favoriteCount: post.favoriteCount,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      writer: {
        id: post.writer.id,
        nickname: post.writer.nickname,
      },
      isFavorite: isLiked,
    };
  }

  // 게시글 수정
  async updatePost(
    updatePostDto: UpdatePostDto,
    postId: string,
    ownerId: string,
  ) {
    // 게시글 작성자가 아닌 경우 예외 처리
    const post = await this.prisma.post.findFirst({
      where: { id: postId, writer: { id: ownerId } },
    });
    if (!post)
      throw new UnauthorizedException('게시글 작성자만 수정할 수 있습니다.');

    // 게시글 수정
    const updatedPost = await this.prisma.post.update({
      where: { id: postId },
      data: updatePostDto,
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        favoriteCount: true,
        createdAt: true,
        updatedAt: true,
        writer: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });

    return updatedPost;
  }

  // 게시글 삭제
  async deletePost(postId: string, ownerId: string) {
    // 게시글 작성자가 아닌 경우 예외 처리
    const post = await this.prisma.post.findFirst({
      where: { id: postId, writer: { id: ownerId } },
    });
    if (!post)
      throw new UnauthorizedException('게시글 작성자만 삭제할 수 있습니다.');

    // 게시글 삭제
    await this.prisma.post.delete({ where: { id: postId } });

    // 삭제 성공 메시지 반환
    return { message: '게시글이 삭제되었습니다.' };
  }

  // 게시글 좋아요
  async addLike(postId: string, userId: string) {
    // 이미 좋아요를 누른 경우 예외 처리
    const like = await this.prisma.like.findFirst({
      where: { postId, userId },
    });
    if (like) throw new ConflictException('이미 좋아요를 눌렀습니다.');

    // 좋아요 추가
    await this.prisma.like.create({
      data: {
        post: { connect: { id: postId } },
        user: { connect: { id: userId } },
      },
    });

    // 좋아요 수 증가
    await this.prisma.post.update({
      where: { id: postId },
      data: {
        favoriteCount: {
          increment: 1,
        },
      },
    });

    return { message: '게시글을 좋아요했습니다.' };
  }

  // 게시글 좋아요 취소
  async removeLike(postId: string, userId: string) {
    // 좋아요를 누르지 않은 경우 예외 처리
    const like = await this.prisma.like.findFirst({
      where: { postId, userId },
    });
    if (!like) throw new NotFoundException('좋아요를 누르지 않았습니다.');

    // 좋아요 삭제
    await this.prisma.like.delete({ where: { id: like.id } });

    // 좋아요 수 감소
    await this.prisma.post.update({
      where: { id: postId },
      data: {
        favoriteCount: {
          decrement: 1,
        },
      },
    });

    return { message: '게시글 좋아요를 취소했습니다.' };
  }

  // 게시글 댓글 작성
  async createComment(postId: string, userId: string, content: string) {
    // 게시글 조회
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    // 게시글이 없는 경우 예외 처리
    if (!post) throw new NotFoundException('게시글을 찾을 수 없습니다.');

    // 댓글 작성
    const comment = await this.prisma.comment.create({
      data: {
        content,
        post: { connect: { id: postId } },
        user: { connect: { id: userId } },
      },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            profile_image: true,
          },
        },
      },
    });

    return {
      writer: {
        image: comment.user.profile_image,
        nickname: comment.user.nickname,
        id: comment.user.id,
      },
      updatedAt: comment.updatedAt.toISOString(),
      createdAt: comment.createdAt.toISOString(),
      content: comment.content,
      id: comment.id,
    };
  }

  // 게시글 전체 댓글 조회
  async getAllComments(postId: string, limit: string, cursor?: string) {
    // 페이지당 가져올 개수 (cursor 기반 페이징을 위해 limit +1 개수 조회)
    const fetchLimit = Number(limit);
    // 해당 상품에 대한 모든 댓글을 최신순으로 조회(cursor로 페이징)
    const comments = await this.prisma.comment.findMany({
      where: {
        postId,
      },
      orderBy: { createdAt: 'desc' },
      take: fetchLimit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            profile_image: true,
          },
        },
      },
    });

    let nextCursor: string | null = null;

    // 가져온 댓글 수가 fetchLimit + 1개인 경우, 다음 페이지 커서를 설정
    if (comments.length > fetchLimit) {
      const nextComment = comments.pop()!;
      nextCursor = nextComment.id;
    }

    const list = comments.map((comment) => ({
      writer: {
        image: comment.user.profile_image,
        nickname: comment.user.nickname,
        id: comment.user.id,
      },
      updatedAt: comment.updatedAt.toISOString(),
      createdAt: comment.createdAt.toISOString(),
      content: comment.content,
      id: comment.id,
    }));

    return {
      nextCursor,
      list,
    };
  }
}
