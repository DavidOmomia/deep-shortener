import * as slugsController from '../../slugsController';
import * as slugsService from '../../slugsService';
import * as slugsConstants from '../../slugsConstants';
import { validate } from '../../../../utils';

jest.mock('../../slugsService');
jest.mock('../../../../utils', () => ({
  validate: jest.fn(),
}));

const mockUser = {
  id: '12345',
  email: 'test@example.com',
  password: 'hashedpassword',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Slugs Controller', () => {
  describe('shortenUrl', () => {
    it('should validate input, call service, and return a shortened URL', async () => {
      const params = { url: 'https://example.com', user: mockUser };
      const validatedParams = { ...params, slug: 'shortslug' };
      const serviceResponse = {
        id: '12345',
        slug: 'shortslug',
        url: 'https://example.com',
        userId: mockUser.id,
      };

      (validate as jest.Mock).mockReturnValue(validatedParams);
      (slugsService.createShortenedUrl as jest.Mock).mockResolvedValue(serviceResponse);

      const response = await slugsController.shortenUrl(params);

      expect(validate).toHaveBeenCalledWith(params, expect.anything());
      expect(slugsService.createShortenedUrl).toHaveBeenCalledWith(validatedParams);
      expect(response).toEqual({
        data: serviceResponse,
        message: slugsConstants.slugCreationSuccessful,
        statusCode: 201,
      });
    });
  });

  describe('redirectUrl', () => {
    it('should validate input, call service, and return a redirect URL', async () => {
      const params = { slug: 'shortslug' };
      const validatedParams = { ...params };
      const serviceResponse = 'https://example.com';

      (validate as jest.Mock).mockReturnValue(validatedParams);
      (slugsService.getOriginalUrl as jest.Mock).mockResolvedValue(serviceResponse);

      const response = await slugsController.redirectUrl(params);

      expect(validate).toHaveBeenCalledWith(params, expect.anything());
      expect(slugsService.getOriginalUrl).toHaveBeenCalledWith(validatedParams);
      expect(response).toEqual({
        redirectUrl: serviceResponse,
        statusCode: 302,
      });
    });
  });

  describe('getUserUrls', () => {
    it('should validate input, call service, and return user URLs', async () => {
      const params = { user: mockUser };
      const validatedParams = { ...params };
      const serviceResponse = [
        {
          id: '1',
          slug: 'shortslug',
          url: 'https://example.com',
          userId: mockUser.id,
          visits: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (validate as jest.Mock).mockReturnValue(validatedParams);
      (slugsService.getUserSlugs as jest.Mock).mockResolvedValue(serviceResponse);

      const response = await slugsController.getUserUrls(params);

      expect(validate).toHaveBeenCalledWith(params, expect.anything());
      expect(slugsService.getUserSlugs).toHaveBeenCalledWith(validatedParams);
      expect(response).toEqual({
        data: serviceResponse,
        message: slugsConstants.getUserUrlsSuccessful,
      });
    });
  });

  describe('modifySlug', () => {
    it('should validate input, call service, and return the updated slug', async () => {
      const params = { slug: 'shortslug', newSlug: 'newslug', user: mockUser };
      const validatedParams = { ...params };
      const serviceResponse = {
        id: '1',
        slug: 'newslug',
        url: 'https://example.com',
        userId: mockUser.id,
      };

      (validate as jest.Mock).mockReturnValue(validatedParams);
      (slugsService.updateSlug as jest.Mock).mockResolvedValue(serviceResponse);

      const response = await slugsController.modifySlug(params);

      expect(validate).toHaveBeenCalledWith(params, expect.anything());
      expect(slugsService.updateSlug).toHaveBeenCalledWith(validatedParams);
      expect(response).toEqual({
        data: serviceResponse,
        message: slugsConstants.updateSlugSuccessful,
      });
    });
  });

  describe('deleteSlug', () => {
    it('should validate input, call service, and return a success message', async () => {
      const params = { slug: 'shortslug', user: mockUser };
      const validatedParams = { ...params };

      (validate as jest.Mock).mockReturnValue(validatedParams);
      (slugsService.deleteSlug as jest.Mock).mockResolvedValue(undefined);

      const response = await slugsController.deleteSlug(params);

      expect(validate).toHaveBeenCalledWith(params, expect.anything());
      expect(slugsService.deleteSlug).toHaveBeenCalledWith(validatedParams);
      expect(response).toEqual({
        message: slugsConstants.deleteSlugSuccessful,
      });
    });
  });
});
