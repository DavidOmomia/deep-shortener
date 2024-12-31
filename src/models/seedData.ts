import dotenv from 'dotenv';
dotenv.config();

import { signup } from '../modules/users/usersController';
import { shortenUrl } from '../modules/slugs/slugsController';
import { sequelize } from './';

export const seedData = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const user = await signup({
      email: 'deep@origin.com',
      password: 'P@ssword1',
    });

    await shortenUrl({
      user: user.data,
      url: 'https://www.deeporigin.com/',
    });

    await shortenUrl({
      user: user.data,
      url: 'https://www.youtube.com/watch?v=ahfled5JDDY&ab_channel=DeepOrigin/',
    });

    await shortenUrl({
      user: user.data,
      url: 'https://www.linkedin.com/company/deep-origin/posts/?feedView=all',
      slug: 'deep-linkedin',
    });

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await sequelize.close();
  }
};

seedData();
