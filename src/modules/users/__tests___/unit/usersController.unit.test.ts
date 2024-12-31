import { signup, login } from '../../usersController';
import * as usersService from '../../usersService';
import * as usersValidation from '../../usersValidation';
import * as usersConstants from '../../usersConstants';
import { validate } from '../../../../utils';

jest.mock('../../usersService');
jest.mock('../../../../utils', () => ({
  validate: jest.fn(),
}));

describe('Users Controller', () => {
  describe('signup', () => {
    it('should validate the input, call the signup service, and return the response', async () => {
      const params = { email: 'test@example.com', password: 'password123' };
      const validatedParams = { ...params };
      const serviceResponse = { id: 1, email: 'test@example.com' };
      const expectedResponse = {
        data: serviceResponse,
        message: usersConstants.signupSuccessful,
      };

      (validate as jest.Mock).mockReturnValue(validatedParams);
      (usersService.signup as jest.Mock).mockResolvedValue(serviceResponse);

      const response = await signup(params);

      expect(validate).toHaveBeenCalledWith(params, usersValidation.signupSchema);
      expect(usersService.signup).toHaveBeenCalledWith(validatedParams);
      expect(response).toEqual(expectedResponse);
    });

    it('should throw an error if validation fails', async () => {
      const params = { email: 'test@example.com', password: 'password123' };

      (validate as jest.Mock).mockImplementation(() => {
        throw new Error('Validation failed');
      });

      await expect(signup(params)).rejects.toThrow('Validation failed');
    });
  });

  describe('login', () => {
    it('should validate the input, call the login service, and return the response', async () => {
      const params = { email: 'test@example.com', password: 'password123' };
      const validatedParams = { ...params };
      const serviceResponse = { token: 'fake-jwt-token' };
      const expectedResponse = {
        data: serviceResponse,
        message: usersConstants.loginSuccessful,
      };

      (validate as jest.Mock).mockReturnValue(validatedParams);
      (usersService.login as jest.Mock).mockResolvedValue(serviceResponse);

      const response = await login(params);

      expect(validate).toHaveBeenCalledWith(params, usersValidation.loginSchema);
      expect(usersService.login).toHaveBeenCalledWith(validatedParams);
      expect(response).toEqual(expectedResponse);
    });

    it('should throw an error if validation fails', async () => {
      const params = { email: 'test@example.com', password: 'password123' };

      (validate as jest.Mock).mockImplementation(() => {
        throw new Error('Validation failed');
      });

      await expect(login(params)).rejects.toThrow('Validation failed');
    });
  });
});
