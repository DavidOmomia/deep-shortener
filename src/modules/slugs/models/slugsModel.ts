import { DataTypes, Model, Sequelize } from 'sequelize';
import { UserModel } from '../../users/usersModel';

export class SlugModel extends Model {
  public id!: string;
  public slug!: string;
  public url!: string;
  public userId!: string;
  public visits!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  public static initModel(sequelize: Sequelize) {
    SlugModel.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        slug: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        url: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        visits: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: 'Slug',
        timestamps: true,
      },
    );
  }

  public static associate() {
    SlugModel.belongsTo(UserModel, {
      foreignKey: 'userId',
      as: 'user',
    });
  }
}