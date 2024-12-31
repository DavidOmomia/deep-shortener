import { validate } from '../../utils';
import * as usersInterface from './usersInterface';
import * as usersValidation from './usersValidation';
import * as usersConstants from './usersConstants';
import * as usersService from './usersService';

export const signup = async (params: usersInterface.SignupDTO) => {
  const value = validate(params, usersValidation.signupSchema);
  const data = await usersService.signup(value);

  return {
    data,
    message: usersConstants.signupSuccessful,
  };
};

export const login = async (params: usersInterface.LoginDTO) => {
  const value = validate(params, usersValidation.loginSchema);
  const data = await usersService.login(value);

  return {
    data,
    message: usersConstants.loginSuccessful,
  };
};