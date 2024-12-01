import { ProductModel } from '../types/models';

export class Product {
  #id;

  #name;

  #description;

  #price;

  #tags;

  #createdAt;

  #updatedAt;

  constructor(param: ProductModel) {
    this.#id = param.id;
    this.#name = param.name;
    this.#description = param.description;
    this.#price = param.price;
    this.#tags = Array.from(param.tags);
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

  getCreatedAt() {
    return this.#createdAt;
  }

  getUpdatedAt() {
    return this.#updatedAt;
  }
}
