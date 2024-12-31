import { UserModel } from './usersModel';

export class UserRepository {
  static async createUser(email: string, password: string) {
    const user = await UserModel.create({ email, password });
    const { password: _, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  static async findUserByEmail(email: string, excludePassword: boolean = true) {
    const attributes = excludePassword ? { exclude: ['password'] } : undefined;
    return await UserModel.findOne({ 
      where: { email },
      attributes,
    });
  }

  static async findUserById(id: number, excludePassword: boolean = true) {
    const attributes = excludePassword ? { exclude: ['password'] } : undefined;
    return await UserModel.findByPk(id, {
      attributes,
    });
  }
}