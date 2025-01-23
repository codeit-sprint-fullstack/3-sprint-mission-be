import { ArticleResponseDto } from '../types/dtos/articleDto';

export default class Article {
  #id;

  #title;

  #content;

  #likeCount;

  #isLiked;

  #createdAt;

  #updatedAt;

  #user;

  #images;

  constructor(param: ArticleResponseDto) {
    this.#id = param.id;
    this.#title = param.title;
    this.#content = param.content;
    this.#likeCount = param.likeCount;
    this.#isLiked = param.isLiked;
    this.#createdAt = param.createdAt;
    this.#updatedAt = param.updatedAt;
    this.#user = {
      image: param.user.image,
      id: param.user.id,
      nickname: param.user.nickname,
    };
    this.#images = param.images;
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

  getLikeCount() {
    return this.#likeCount;
  }

  getIsLiked() {
    return this.#isLiked;
  }

  getUser() {
    return this.#user;
  }

  getImages() {
    return this.#images;
  }

  toJSON() {
    return {
      id: this.getId(),
      title: this.getTitle(),
      content: this.getContent(),
      images: this.getImages(),
      likeCount: this.getLikeCount(),
      isLiked: this.getIsLiked(),
      createdAt: this.getCreatedAt(),
      updatedAt: this.getUpdatedAt(),
      user: this.getUser(),
    };
  }
}
