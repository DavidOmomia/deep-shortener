import { SlugModel } from './models/slugsModel';

export class SlugRepository {
  static async createSlug(slug: string, url: string, userId: string) {
    return await SlugModel.create({ slug, url, userId });
  }

  static async findSlugBySlug(slug: string) {
    return await SlugModel.findOne({ where: { slug } });
  }

  static async findSlugsByUserId(userId: string) {
    return await SlugModel.findAll({ 
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
  }

  static async updateSlug(slug: string, newSlug: string) {
    return await SlugModel.update({ slug: newSlug }, { where: { slug } });
  }

  static async incrementVisits(slug: string) {
    return await SlugModel.increment('visits', { where: { slug } });
  }

  static async deleteSlug(slug: string) {
    return await SlugModel.destroy({ where: { slug } });
  }
}
