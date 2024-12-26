import { CommentModel } from '../types/models';
import { userInfo } from '../types/dtos/userDto';

export class Comment {
  #id: number;

  #content: string;

  #createdAt: Date;

  #updatedAt: Date;

  #user: userInfo;

  constructor(param: CommentModel) {
    this.#id = param.id;
    this.#content = param.content;
    this.#createdAt = param.createdAt;
    this.#updatedAt = param.updatedAt;
    this.#user = {
      id: param.user.id,
      image: param.user.image,
      nickname: param.user.nickname,
    };
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

  getUser() {
    return this.#user;
  }

  toJSON() {
    return {
      id: this.getId(),
      content: this.getContent(),
      createdAt: this.getCreatedAt(),
      updatedAt: this.getUpdatedAt(),
      user: this.getUser(),
    };
  }
}
