import * as usersService from '../../usersService';
import { UserRepository } from '../../usersRepository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env, UnprocessableEntityError } from '../../../../utils';

jest.mock('../../usersRepository');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../../../utils', () => ({
  ...jest.requireActual('../../../../utils'),
  env: jest.fn(),
}));
jest.mock('../../../../utils/logger', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

jest.mock('../../../../utils/', () => ({
  env: jest.fn((key) => {
    switch (key) {
      case 'APP_FRONTEND_NOT_FOUND_URL':
        return 'https://example.com/not-found';
      case 'BASE_URL':
        return 'https://short.ly';
      case 'JWT_SECRET':
        return 'mocked-secret';
      default:
        return undefined;
    }
  }),
}));

describe('Users Service', () => {
  describe('signup', () => {
    it('should hash the password, create a new user, and return it', async () => {
      const params = { email: 'test@example.com', password: 'password123' };
      const hashedPassword = 'hashedpassword123';
      const userResponse = { id: 1, email: 'test@example.com' };

      (UserRepository.findUserByEmail as jest.Mock).mockResolvedValue(null); // No existing user
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (UserRepository.createUser as jest.Mock).mockResolvedValue(userResponse);

      const result = await usersService.signup(params);

      expect(UserRepository.findUserByEmail).toHaveBeenCalledWith(params.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(params.password, 10);
      expect(UserRepository.createUser).toHaveBeenCalledWith(params.email, hashedPassword);
      expect(result).toEqual(userResponse);
    });

    it('should throw an error if the user already exists', async () => {
      const params = { email: 'test@example.com', password: 'password123' };
      const existingUser = { id: 1, email: 'test@example.com' };

      (UserRepository.findUserByEmail as jest.Mock).mockResolvedValue(existingUser);

      await expect(usersService.signup(params)).rejects.toThrow(UnprocessableEntityError);
      expect(UserRepository.findUserByEmail).toHaveBeenCalledWith(params.email);
    });
  });

  describe('login', () => {
    it('should validate the password, generate a token, and return user data with the token', async () => {
      const params = { email: 'test@example.com', password: 'password123' };
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedpassword123',
      };
      const jwtSecret = 'secret';
      const token = 'jsonwebtoken123';

      (UserRepository.findUserByEmail as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (env as jest.Mock).mockReturnValue(jwtSecret);
      (jwt.sign as jest.Mock).mockReturnValue(token);

      const result = await usersService.login(params);

      expect(UserRepository.findUserByEmail).toHaveBeenCalledWith(params.email, false);
      expect(bcrypt.compare).toHaveBeenCalledWith(params.password, user.password);
      expect(jwt.sign).toHaveBeenCalledWith({ userId: user.id }, jwtSecret);
      expect(result).toEqual({
        id: user.id,
        email: user.email,
        token,
      });
    });

    it('should throw an error if the user does not exist', async () => {
      const params = { email: 'test@example.com', password: 'password123' };

      (UserRepository.findUserByEmail as jest.Mock).mockResolvedValue(null);

      await expect(usersService.login(params)).rejects.toThrow(UnprocessableEntityError);
      expect(UserRepository.findUserByEmail).toHaveBeenCalledWith(params.email, false);
    });

    it('should throw an error if the password is invalid', async () => {
      const params = { email: 'test@example.com', password: 'wrongpassword' };
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedpassword123',
      };

      (UserRepository.findUserByEmail as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Password mismatch

      await expect(usersService.login(params)).rejects.toThrow(UnprocessableEntityError);
      expect(bcrypt.compare).toHaveBeenCalledWith(params.password, user.password);
    });
  });
});
