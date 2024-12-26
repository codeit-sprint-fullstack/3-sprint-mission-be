import { UserModel } from '../types/models';

export default class User {
  #id: number;
  #email: string;
  #nickname: string;
  #encryptedPassword: string;
  #image: string | null;
  #createdAt: Date;
  #updatedAt: Date;

  constructor(param: UserModel) {
    this.#id = param.id;
    this.#email = param.email;
    this.#nickname = param.nickname;
    this.#encryptedPassword = param.encryptedPassword;
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
      nickname: this.getEmail(),
      image: this.getImage(),
      createdAt: this.getCreatedAt(),
      updatedAt: this.getUpdatedAt(),
    };
  }
}
