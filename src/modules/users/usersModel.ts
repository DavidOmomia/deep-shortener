import { DataTypes, Model, Sequelize } from 'sequelize';
import { SlugModel } from '../slugs/models/slugsModel';

export class UserModel extends Model {
  public id!: string;
  public email!: string;
  public password!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  public static initModel(sequelize: Sequelize) {
    UserModel.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'User',
        timestamps: true,
      },
    );
  }

  public static associate() {
    UserModel.hasMany(SlugModel, {
      foreignKey: 'userId',
      as: 'slugs',
    });
  }
}