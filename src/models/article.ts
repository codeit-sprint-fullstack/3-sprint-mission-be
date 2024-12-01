import { ArticleModel } from '../types/models';

export class Article {
  #id;

  #title;

  #content;

  #createdAt;

  #updatedAt;

  constructor(param: ArticleModel) {
    this.#id = param.id;
    this.#title = param.title;
    this.#content = param.content;
    this.#createdAt = param.createdAt;
    this.#updatedAt = param.updatedAt;
  }

  getId() {
    return this.#id;
  }

  getTitle() {
    return this.#title;
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
}
