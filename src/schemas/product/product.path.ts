/**
 * @swagger
 * /products:
 *   get:
 *     summary: 상품 목록 조회
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 페이지당 상품 수
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [recent,favorite]
 *         description: 정렬 기준
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 검색 키워드
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: 상품 생성
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductRequest'
 *     responses:
 *       201:
 *         description: 상품 작성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: 인증되지 않은 사용자
 */

/**
 * @swagger
 * /products/{productId}:
 *   get:
 *     summary: 상품 조회
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 조회할 상품의 ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: 상품 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: 인증되지 않은 사용자
 */

/**
 * @swagger
 * /products/{productId}:
 *   patch:
 *     summary: 상품 수정
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatchProductRequest'
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 수정할 상품의 ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: 상품 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: 인증되지 않은 사용자
 */

/**
 * @swagger
 * /products/{productId}:
 *   delete:
 *     summary: 상품 삭제
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 삭제할 상품의 ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: 상품 삭제 성공
 *       401:
 *         description: 인증되지 않은 사용자
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailMessage'
 *       403:
 *         description: 권한 없는 사용자
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailMessage'
 */

/**
 * @swagger
 * /products/{productId}/favorite:
 *   post:
 *     summary: 상품 좋아요
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 좋아요 할 상품의 ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 상품 좋아요 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: 상품을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailMessage'
 *       401:
 *         description: 인증되지 않은 사용자
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailMessage'
 *       409:
 *         description: 이미 좋아요가 눌린 상품
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailMessage'
 */

/**
 * @swagger
 * /products/{productId}/like:
 *   delete:
 *     summary: 상품 좋아요 취소
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 좋아요 취소할 상품의 ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 상품 좋아요 취소 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: 상품을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailMessage'
 *       401:
 *         description: 인증되지 않은 사용자
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailMessage'
 *       409:
 *         description: 이미 좋아요가 취소된 상품
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailMessage'
 */
