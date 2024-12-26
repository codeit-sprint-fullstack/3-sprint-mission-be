export class Comment {
  /** ID */
  _id;

  /** 게시글 ID */
  _articleId;

  /** 상품 ID */
  _productId;

  /** 내용 */
  _content;

  /** 작성시각 */
  _createdAt;

  /** 마지막 수정시각 */
  _updatedAt;

  constructor(param) {
      this._id = param.id;
      this._articleId = param.articleId;
      this._productId = param.productId;
      this._content = param.content;
      this._createdAt = param.createdAt;
      this._updatedAt = param.updatedAt;
  }

  getId() {
      return this._id;
  }

  getArticleId() {
      return this._articleId;
  }

  getProductId() {
      return this._productId;
  }

  getContent() {
      return this._content;
  }

  getCreatedAt() {
      return this._createdAt;
  }

  getUpdatedAt() {
      return this._updatedAt;
  }
}
