/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         price:
 *           type: integer
 *         favoriteCount:
 *           type: integer
 *         isFavorite:
 *           type: boolean
 *         userId:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateProductRequest:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - tags
 *       properties:
 *         name:
 *           type: string
 *           description: 상품 이름
 *         description:
 *           type: string
 *           description: 상품 설명
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: 이미지 URL 배열
 *         price:
 *           type: number
 *           description: 상품 가격
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: 상품 태그
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateProductRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: 상품 이름
 *         description:
 *           type: string
 *           description: 상품 설명
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: 이미지 URL 배열
 *         price:
 *           type: number
 *           description: 상품 가격
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: 상품 태그
 */
