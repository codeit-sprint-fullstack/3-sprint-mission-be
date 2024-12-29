import { userInfo } from './dtos/userDto';

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
