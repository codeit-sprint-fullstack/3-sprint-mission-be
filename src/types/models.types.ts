import { userInfo } from './user.types';

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
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductModel {
  id: number;
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
  favoriteCount: number;
  isFavorite: boolean;
  user: userInfo;
  createdAt: Date;
  updatedAt: Date;
}

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
