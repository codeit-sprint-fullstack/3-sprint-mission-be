export interface ProductModel {
  id: string;
  name: string;
  description: string;
  price: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ArticleModel {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
