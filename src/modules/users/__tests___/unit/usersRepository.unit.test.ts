import { UserRepository } from '../../usersRepository';
import { UserModel } from '../../usersModel';

jest.mock('../../usersModel');

describe('UserRepository', () => {
  describe('createUser', () => {
    it('should create a new user and return it without the password', async () => {
      const mockUser = {
        id: '12345',
        email: 'test@example.com',
        password: 'hashedpassword',
        toJSON: jest.fn().mockReturnValue({
          id: '12345',
          email: 'test@example.com',
          password: 'hashedpassword',
        }),
      };

      (UserModel.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserRepository.createUser('test@example.com', 'hashedpassword');

      expect(UserModel.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'hashedpassword',
      });
      expect(result).toEqual({
        id: '12345',
        email: 'test@example.com',
      });
    });
  });

  describe('findUserByEmail', () => {
    it('should find a user by email and exclude the password by default', async () => {
      const mockUser = { id: '12345', email: 'test@example.com' };

      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserRepository.findUserByEmail('test@example.com');

      expect(UserModel.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        attributes: { exclude: ['password'] },
      });
      expect(result).toEqual(mockUser);
    });

    it('should find a user by email and include the password when specified', async () => {
      const mockUser = { id: '12345', email: 'test@example.com', password: 'hashedpassword' };

      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserRepository.findUserByEmail('test@example.com', false);

      expect(UserModel.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findUserById', () => {
    it('should find a user by ID and exclude the password by default', async () => {
      const mockUser = { id: '12345', email: 'test@example.com' };

      (UserModel.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserRepository.findUserById(12345);

      expect(UserModel.findByPk).toHaveBeenCalledWith(12345, {
        attributes: { exclude: ['password'] },
      });
      expect(result).toEqual(mockUser);
    });

    it('should find a user by ID and include the password when specified', async () => {
      const mockUser = { id: '12345', email: 'test@example.com', password: 'hashedpassword' };

      (UserModel.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserRepository.findUserById(12345, false);

      expect(UserModel.findByPk).toHaveBeenCalledWith(12345, {});
      expect(result).toEqual(mockUser);
    });
  });
});
