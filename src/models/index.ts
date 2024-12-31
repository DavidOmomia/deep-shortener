import { sequelize } from '../utils';
import { UserModel } from '../modules/users/usersModel';
import { SlugModel } from '../modules/slugs/models/slugsModel';
import { SlugConfig } from '../modules/slugs/models/slugsConfigModel';

// Initialize all models
UserModel.initModel(sequelize);
SlugModel.initModel(sequelize);
SlugConfig.initModel(sequelize);

// Associate all models
UserModel.associate();
SlugModel.associate();

export { sequelize };