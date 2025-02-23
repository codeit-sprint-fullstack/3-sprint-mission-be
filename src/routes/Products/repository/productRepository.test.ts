import { prismaTestClient } from '@/jest.setup';
import ProductRepository from './productRepository';
import { clearMocks } from '@/mocks/service/clearMocks';
import { mockUser } from '@/mocks/service/mockUser';
import { mockProduct } from '@/mocks/service/mockProduct';

describe('productRepository', () => {
  const productRepository = new ProductRepository(prismaTestClient);

  describe('상품 생성,삭제,수정 테스트', () => {
    beforeEach(async () => {
      await prismaTestClient.$transaction(async (tx) => {
        await clearMocks(tx);
        await mockUser(tx);
        await mockProduct(tx);
      });
    });

    afterAll(async () => {
      prismaTestClient.$transaction(async (tx) => await clearMocks(tx));
    });

    test('정상적으로 상품 생성', async () => {
      const mockProduct = {
        id: 11,
        name: '상품 11',
        description: '상품 11입니다.',
        price: 5000,
        images: [],
        userId: 1,
        updatedAt: new Date(),
        createdAt: new Date(),
        tags: [],
      };

      const newProduct = await productRepository.create(1, mockProduct);
      expect(newProduct).toBeDefined();
      expect(newProduct.id).toBe(mockProduct.id);
      expect(newProduct.name).toBe(mockProduct.name);
      expect(newProduct.description).toBe(mockProduct.description);
      expect(newProduct.price).toBe(mockProduct.price);
      expect(newProduct.images.length).toBe(mockProduct.images.length);
      expect(newProduct.user.id).toBe(mockProduct.userId);
      expect(newProduct._count.favorites).toBe(0);
      expect(newProduct.favorites.length).toBe(0);
    });

    test('정상적으로 상품 삭제', async () => {
      const productBeforeDelete = await productRepository.findById(1, 1);
      await productRepository.delete(1);
      const productAfterDelete = await productRepository.findById(1, 1);

      expect(productBeforeDelete).not.toBeNull();
      expect(productAfterDelete).toBeNull();
    });

    test('정상적으로 상품 수정', async () => {
      const editingContent = {
        name: '수정된 상품',
        description: '수정된 상품입니다.',
        price: 5000,
        images: [],
        userId: 1,
        tags: [],
      };

      await productRepository.update(1, 1, editingContent);
      const productAfterEdit = await productRepository.findById(1, 1);

      expect(productAfterEdit.name).toBe(editingContent.name);
      expect(productAfterEdit.description).toBe(editingContent.description);
    });

    describe('상품 조회 테스트', () => {
      beforeAll(async () => {
        prismaTestClient.$transaction(async (tx) => {
          await clearMocks(tx);
          await mockUser(tx);
          await mockProduct(tx);
        });
      });
      afterAll(async () => {
        prismaTestClient.$transaction(async (tx) => await clearMocks(tx));
      });

      test('상품 조회', async () => {
        const response = await productRepository.findById(1, 1);

        expect(response).toBeDefined();
        expect(response.id).toBe(1);
      });

      test('최신순 정렬', async () => {
        const response = await productRepository.getProductList({
          page: 1,
          pageSize: 10,
          orderBy: 'recent',
        });

        expect(response.list[0].createdAt.getTime()).toBeGreaterThan(
          response.list[1].createdAt.getTime(),
        );
      });

      test('좋아요순 정렬', async () => {
        const response = await productRepository.getProductList({
          page: 1,
          pageSize: 10,
          orderBy: 'favorite',
        });

        expect(response.list[0]._count.favorites).toBeGreaterThan(
          response.list[1]._count.favorites,
        );
      });

      test.each([1, 5, 10])('pageSize가 %i일 때 조회되는 개수 확인', async (pageSize) => {
        const response = await productRepository.getProductList({
          page: 1,
          pageSize,
          orderBy: 'favorite',
        });

        expect(response.list.length).toBe(pageSize);
      });

      test.each(['상품 1', '상품 5', '상품 10'])('word가 %s일 때 일치 여부', async (word) => {
        const response = await productRepository.getProductList({
          page: 1,
          pageSize: 10,
          orderBy: 'favorite',
          word,
        });
        const searchRegex = new RegExp(word);

        response.list.forEach((product) => {
          expect(searchRegex.test(product.name) || searchRegex.test(product.description)).toBe(
            true,
          );
        });
      });
    });
  });
});
