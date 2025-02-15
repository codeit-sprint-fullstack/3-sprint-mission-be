import type { ProductModel } from '@/types/models.types';
import type { UserInfo } from '@/types/user.types';

export class Product {
  #id: number;

  #name: string;

  #description: string;

  #price: number;

  #tags: string[];

  #images: string[];

  #favoriteCount: number;

  #isFavorite: boolean;

  #user: UserInfo;

  #createdAt: Date;

  #updatedAt: Date;

  constructor(param: ProductModel) {
    this.#id = param.id;
    this.#name = param.name;
    this.#description = param.description;
    this.#price = param.price;
    this.#tags = Array.from(param.tags);
    this.#images = Array.from(param.images);
    this.#favoriteCount = param.favoriteCount;
    this.#isFavorite = param.isFavorite;
    this.#user = {
      id: param.user.id,
      nickname: param.user.nickname,
      image: param.user.image,
    };
    this.#createdAt = param.createdAt;
    this.#updatedAt = param.updatedAt;
  }

  getId() {
    return this.#id;
  }

  getName() {
    return this.#name;
  }

  getDescription() {
    return this.#description;
  }

  getPrice() {
    return this.#price;
  }

  getTags() {
    return this.#tags;
  }

  getImages() {
    return this.#images;
  }

  getFavoriteCount() {
    return this.#favoriteCount;
  }

  getIsFavorite() {
    return this.#isFavorite;
  }

  getUser() {
    return this.#user;
  }

  getCreatedAt() {
    return this.#createdAt;
  }

  getUpdatedAt() {
    return this.#updatedAt;
  }

  toJSON() {
    return {
      name: this.getName(),
      price: this.getPrice(),
      description: this.getDescription(),
      tags: this.getTags(),
      images: this.getImages(),
      id: this.getId(),
      favoriteCount: this.getFavoriteCount(),
      isFavorite: this.getIsFavorite(),
      user: this.getUser(),
      createdAt: this.getCreatedAt(),
      updatedAt: this.getUpdatedAt(),
    };
  }
}
