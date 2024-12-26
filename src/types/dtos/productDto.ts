import { userInfo } from './userDto';

export interface ProductRequestDto {
  description: string;
  name: string;
  price: number;
  tags: string[];
  images: string[];
}

export interface ProductResponseDto {
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

export interface GetProductListParams {
  page: number;
  pageSize: number;
  orderBy: 'favorite' | 'recent';
  keyword?: string;
}
