import { SlugRepository } from '../../slugsRepository';
import { SlugModel } from '../../models/slugsModel';

jest.mock('../../models/slugsModel');

describe('SlugRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createSlug', () => {
    it('should create a slug and return the created slug', async () => {
      const mockSlug = {
        id: '1',
        slug: 'shortslug',
        url: 'https://example.com',
        userId: '12345',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (SlugModel.create as jest.Mock).mockResolvedValue(mockSlug);

      const result = await SlugRepository.createSlug(
        'shortslug',
        'https://example.com',
        '12345'
      );

      expect(SlugModel.create).toHaveBeenCalledWith({
        slug: 'shortslug',
        url: 'https://example.com',
        userId: '12345',
      });
      expect(result).toEqual(mockSlug);
    });
  });

  describe('findSlugBySlug', () => {
    it('should find a slug by its slug', async () => {
      const mockSlug = {
        id: '1',
        slug: 'shortslug',
        url: 'https://example.com',
        userId: '12345',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (SlugModel.findOne as jest.Mock).mockResolvedValue(mockSlug);

      const result = await SlugRepository.findSlugBySlug('shortslug');

      expect(SlugModel.findOne).toHaveBeenCalledWith({
        where: { slug: 'shortslug' },
      });
      expect(result).toEqual(mockSlug);
    });
  });

  describe('findSlugsByUserId', () => {
    it('should find slugs by user ID in descending order of creation', async () => {
      const mockSlugs = [
        {
          id: '1',
          slug: 'shortslug1',
          url: 'https://example1.com',
          userId: '12345',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          slug: 'shortslug2',
          url: 'https://example2.com',
          userId: '12345',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (SlugModel.findAll as jest.Mock).mockResolvedValue(mockSlugs);

      const result = await SlugRepository.findSlugsByUserId('12345');

      expect(SlugModel.findAll).toHaveBeenCalledWith({
        where: { userId: '12345' },
        order: [['createdAt', 'DESC']],
      });
      expect(result).toEqual(mockSlugs);
    });
  });

  describe('updateSlug', () => {
    it('should update a slug and return the result', async () => {
      (SlugModel.update as jest.Mock).mockResolvedValue([1]);

      const result = await SlugRepository.updateSlug('shortslug', 'newslug');

      expect(SlugModel.update).toHaveBeenCalledWith(
        { slug: 'newslug' },
        { where: { slug: 'shortslug' } }
      );
      expect(result).toEqual([1]);
    });
  });

  describe('incrementVisits', () => {
    it('should increment visits for a slug and return the result', async () => {
      const mockIncrementResult = [{ visits: 1 }];

      (SlugModel.increment as jest.Mock).mockResolvedValue(mockIncrementResult);

      const result = await SlugRepository.incrementVisits('shortslug');

      expect(SlugModel.increment).toHaveBeenCalledWith('visits', {
        where: { slug: 'shortslug' },
      });
      expect(result).toEqual(mockIncrementResult);
    });
  });

  describe('deleteSlug', () => {
    it('should delete a slug and return the number of rows deleted', async () => {
      (SlugModel.destroy as jest.Mock).mockResolvedValue(1);

      const result = await SlugRepository.deleteSlug('shortslug');

      expect(SlugModel.destroy).toHaveBeenCalledWith({
        where: { slug: 'shortslug' },
      });
      expect(result).toEqual(1);
    });
  });
});
