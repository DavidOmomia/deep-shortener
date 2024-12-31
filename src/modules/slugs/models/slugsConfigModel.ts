import { DataTypes, Model, Sequelize } from 'sequelize';

export class SlugConfig extends Model {
  public id!: string;
  public currentLength!: number;
  public currentIndex!: string;
  public totalSpace!: string;  
  public generatedCount!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  public static initModel(sequelize: Sequelize) {
    SlugConfig.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        currentLength: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        currentIndex: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        totalSpace: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        generatedCount: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'SlugConfig',
        tableName: 'slug_config',
        timestamps: true,
      },
    );
  }
}