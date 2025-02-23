import { prismaTestClient } from '@/jest.setup';
import { clearMocks } from '@/mocks/service/clearMocks';
import { mockProduct } from '@/mocks/service/mockProduct';
import { mockUser } from '@/mocks/service/mockUser';
import FavoriteRepository from './favoriteRepository';

describe.skip('favoriteRepository', () => {
  const favoriteRepository = new FavoriteRepository(prismaTestClient);

  beforeEach(async () => {
    await prismaTestClient.$transaction(async (tx) => {
      await clearMocks(tx);
      await mockUser(tx);
      await mockProduct(tx);
    });
  });

  afterAll(async () => {
    await prismaTestClient.$transaction(async (tx) => clearMocks(tx));
  });

  test('좋아요 갯수 확인', async () => {
    const favoriteCount = await favoriteRepository.countFavorite(1);
    expect(favoriteCount).toBe(10);
  });

  test('좋아요 여부 확인:true', async () => {
    const isFavorite = await favoriteRepository.findIsFavorite(1, 1);
    expect(isFavorite).toBe(true);
  });

  test('좋아요 여부 확인:false', async () => {
    const isFavorite = await favoriteRepository.findIsFavorite(10, 2);
    expect(isFavorite).toBe(false);
  });

  test('좋아요 설정:좋아요가 눌리지 않은 상품', async () => {
    const isFavoriteBefore = await favoriteRepository.findIsFavorite(10, 2);
    await favoriteRepository.setFavorite(10, 2);
    const isFavoriteAfter = await favoriteRepository.findIsFavorite(10, 2);
    expect(isFavoriteBefore).toBe(false);
    expect(isFavoriteAfter).toBe(true);
  });

  test('좋아요 설정:이미 좋아요가 눌린 상품', async () => {
    const isFavoriteBefore = await favoriteRepository.findIsFavorite(10, 1);
    expect(isFavoriteBefore).toBe(true);
    await expect(favoriteRepository.setFavorite(10, 1)).rejects.toThrow();
  });

  test('좋아요 취소:좋아요가 설정돼 있는 상품', async () => {
    const isFavoriteBefore = await favoriteRepository.findIsFavorite(1, 1);
    await favoriteRepository.deleteFavorite(1, 1);
    const isFavoriteAfter = await favoriteRepository.findIsFavorite(1, 1);
    expect(isFavoriteBefore).toBe(true);
    expect(isFavoriteAfter).toBe(false);
  });

  test('좋아요 취소:이미 좋아요가 취소된 상품', async () => {
    const isFavoriteBefore = await favoriteRepository.findIsFavorite(10, 2);
    expect(isFavoriteBefore).toBe(false);
    await expect(favoriteRepository.deleteFavorite(10, 2)).rejects.toThrow();
  });
});
