import { UserModel } from '../types/models.types';

export default class User {
  #id: number;
  #email: string;
  #nickname: string;
  #image: string | null;
  #createdAt: Date;
  #updatedAt: Date;

  constructor(param: UserModel) {
    this.#id = param.id;
    this.#email = param.email;
    this.#nickname = param.nickname;
    this.#image = param.image;
    this.#createdAt = param.createdAt;
    this.#updatedAt = param.updatedAt;
  }

  getId() {
    return this.#id;
  }

  getEmail() {
    return this.#email;
  }

  getNickname() {
    return this.#nickname;
  }

  getImage() {
    return this.#image;
  }

  getCreatedAt() {
    return this.#createdAt;
  }

  getUpdatedAt() {
    return this.#updatedAt;
  }

  toJSON() {
    return {
      id: this.getId(),
      email: this.getEmail(),
      nickname: this.getNickname(),
      image: this.getImage(),
      createdAt: this.getCreatedAt(),
      updatedAt: this.getUpdatedAt(),
    };
  }
}
