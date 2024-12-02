import { CommentModel } from '../types/models';

export class Comment {
  #id: string;

  #content: string;

  #createdAt: Date;

  #updatedAt: Date;

  #productId: string | null;

  #articleId: string | null;

  constructor(param: CommentModel) {
    this.#id = param.id;
    this.#content = param.content;
    this.#createdAt = param.createdAt;
    this.#updatedAt = param.updatedAt;
    this.#productId = param.productId;
    this.#articleId = param.articleId;
  }

  getId() {
    return this.#id;
  }

  getContent() {
    return this.#content;
  }

  getCreatedAt() {
    return this.#createdAt;
  }

  getUpdatedAt() {
    return this.#updatedAt;
  }

  getProductId() {
    return this.#productId;
  }

  getArticleId() {
    return this.#articleId;
  }
}
