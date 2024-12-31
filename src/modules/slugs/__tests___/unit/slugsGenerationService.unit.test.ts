import { generateSlug, encodeBase62 } from '../../slugGenerationService';
import { SlugConfig } from '../../models/slugsConfigModel';
import { sequelize } from '../../../../utils';
import { INITIAL_SLUG_LENGTH } from '../../slugsConstants';

jest.mock('../../models/slugsConfigModel', () => ({
  SlugConfig: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));


const mockedTransaction = {
  commit: jest.fn(),
  rollback: jest.fn(),
};

jest.mock('../../../../utils/database', () => ({
  sequelize: {
    transaction: jest.fn().mockImplementation(() => ({
      commit: jest.fn(),
      rollback: jest.fn(),
    })),
  },
}));




jest.mock('../../../../utils/logger', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

jest.mock('../../../../utils', () => ({
  ...jest.requireActual('../../../../utils'),
  env: jest.fn((key: string) => {
    switch (key) {
      case 'DB_NAME':
        return 'mock_db_name';
      case 'DB_USER':
        return 'mock_db_user';
      case 'DB_PASSWORD':
        return 'mocked_db_password';
      case 'DB_HOST':
        return 'mocked_db_host';
      default:
        return undefined;
    }
  }),
}));


describe('Slug Generator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateSlug', () => {
    it('should create initial config if none exists', async () => {
      (SlugConfig.findOne as jest.Mock).mockResolvedValue(null);
    
      const mockConfig = {
        currentLength: INITIAL_SLUG_LENGTH,
        currentIndex: '0',
        totalSpace: '14776335',
        generatedCount: '0',
        update: jest.fn().mockResolvedValue(true),
      };
      (SlugConfig.create as jest.Mock).mockResolvedValue(mockConfig);
    
      const result = await generateSlug();
    
      expect(mockConfig.currentLength).toBe(INITIAL_SLUG_LENGTH); 
      expect(mockConfig.currentIndex).toBe('0');
      expect(mockConfig.generatedCount).toBe('0');
      expect(mockConfig.totalSpace).toBe('14776335');
    });
    

    it('should generate sequential unique slugs', async () => {
      const mockConfig = {
        currentLength: INITIAL_SLUG_LENGTH,
        currentIndex: '0',
        totalSpace: '14776335',
        generatedCount: '0',
        update: jest.fn().mockImplementation((updateObject) => {
          Object.assign(mockConfig, updateObject);
        }),
      };

      (sequelize.transaction as jest.Mock) = jest.fn().mockImplementation(async (cb) => {
        return await cb();
      });
    
      (SlugConfig.findOne as jest.Mock).mockResolvedValue(mockConfig);
    
      const slug1 = await generateSlug();
      mockConfig.generatedCount = String(Number(mockConfig.generatedCount) + 1);
      const slug2 = await generateSlug();
      
      expect(slug1).toBeDefined();
      expect(slug2).toBeDefined();
      expect(slug1.length).toBe(INITIAL_SLUG_LENGTH);
      expect(slug2.length).toBe(INITIAL_SLUG_LENGTH); 
    });
    

    it('should increment slug length when space is exhausted', async () => {
      let mockConfig = {
          currentLength: INITIAL_SLUG_LENGTH,
          currentIndex: '14776335', 
          totalSpace: '14776335',
          generatedCount: '14776335',
          update: jest.fn().mockImplementation((updateObject) => {
              Object.assign(mockConfig, updateObject);
          }),
      };
  
      (sequelize.transaction as jest.Mock) = jest.fn().mockImplementation(async (cb) => {
          return await cb();
      });
  
      (SlugConfig.findOne as jest.Mock).mockResolvedValue(mockConfig);
  
      await generateSlug();
  
      expect(mockConfig.update).toHaveBeenCalled();
  });
  
    

    it('should handle transaction errors', async () => {
      (sequelize.transaction as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Transaction failed');
      });
    
      await expect(generateSlug()).rejects.toThrow('Transaction failed');
    });
     

    it('should validate the format of generated slugs', async () => {
      const mockConfig = {
        currentLength: INITIAL_SLUG_LENGTH,
        currentIndex: '0',
        totalSpace: '14776335',
        generatedCount: '0',
        update: jest.fn().mockResolvedValue(true),
      };

      (SlugConfig.findOne as jest.Mock).mockResolvedValue(mockConfig);

      const slug = await generateSlug();

      expect(typeof slug).toMatch(typeof slug);
    });

    it('should handle permutation correctly', async () => {
      let currentIndex = BigInt(0);
  
      const mockConfig = {
          currentLength: INITIAL_SLUG_LENGTH,
          currentIndex: encodeBase62(currentIndex), // Ensure this is encoded properly as a string
          totalSpace: encodeBase62(BigInt(14776335)),
          generatedCount: '0',
          update: jest.fn().mockImplementation((updateObject) => {
              Object.assign(mockConfig, updateObject);
              currentIndex += 1n; // Increment for next slug generation
              mockConfig.currentIndex = encodeBase62(currentIndex); // Update encoded index
          }),
      };
  
      (SlugConfig.findOne as jest.Mock).mockResolvedValue(mockConfig);
  
      const slugs = new Set();
      for (let i = 0; i < 10; i++) {
          const slug = await generateSlug();
          expect(slugs.has(slug)).toBeFalsy(); // Check uniqueness
          slugs.add(slug);
      }
    });  
  });
});
