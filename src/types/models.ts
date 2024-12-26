import { userInfo } from './dtos/userDto';

export interface ArticleModel {
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

export interface CommentModel {
  id: number;
  productId: number | null;
  articleId: number | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: userInfo;
}

export interface UserModel {
  id: number;
  email: string;
  nickname: string;
  encryptedPassword: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}
