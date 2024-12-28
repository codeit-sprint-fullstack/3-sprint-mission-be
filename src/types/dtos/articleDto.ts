import { userInfo } from './userDto';

export interface ArticleRequestDto {
  title: string;
  content: string;
  images: string[];
}

export interface ArticleResponseDto {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  images: string[];
  user: userInfo;
  isLiked: boolean;
  likeCount: number;
}

export interface GetArticleListParams {
  page: number;
  pageSize: number;
  orderBy: 'like' | 'recent';
  keyword?: string;
}
