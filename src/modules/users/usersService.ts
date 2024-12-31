import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from './usersRepository';
import { SignupDTO, LoginDTO } from './usersInterface';
import { env, UnprocessableEntityError } from '../../utils';

export const signup = async (params: SignupDTO) => {
  const { email, password } = params;
  const existingUser = await UserRepository.findUserByEmail(email);

  if (existingUser) {
    throw new UnprocessableEntityError({
      message: 'User already exists',
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await UserRepository.createUser(email, hashedPassword);
  return user;
};

export const login = async (params: LoginDTO) => {
  const { email, password } = params;
  const user = await UserRepository.findUserByEmail(email, false);

  if (!user) {
    throw new UnprocessableEntityError({
      message: 'Invalid email or password',
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnprocessableEntityError({
      message: 'Invalid email or password',
    });
  }

  const jwtSecret = env('JWT_SECRET');
  const token = jwt.sign({ userId: user.id }, jwtSecret);

  return { 
    id: user.id,
    email: user.email,
    token 
  };
};
