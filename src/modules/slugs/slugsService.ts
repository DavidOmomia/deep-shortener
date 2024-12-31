import { SlugRepository } from './slugsRepository';
import { env, isValidUrl, UnprocessableEntityError, normalizeUrl } from '../../utils';
import * as slugsInterface from './slugsInterface';
import { generateSlug } from './slugGenerationService';

export const createShortenedUrl = async ({ url, user, slug }: slugsInterface.CreateShortenedUrlDTO): Promise<slugsInterface.SlugDTO> => {
  const normalizedUrl = normalizeUrl(url);
  if (!isValidUrl(normalizedUrl)) {
    throw new UnprocessableEntityError({ message: 'Invalid URL' });
  }

  if (!slug) {
    return generateAutoSlug(normalizedUrl, user.id);
  }

  const existingSlug = await SlugRepository.findSlugBySlug(slug);
  if (existingSlug) {
    throw new UnprocessableEntityError({ message: 'Slug already exists' });
  }

  const newSlug = await SlugRepository.createSlug(slug, normalizedUrl, user.id);
  return newSlug;
};

export const getOriginalUrl = async ({ slug }: slugsInterface.GetOriginalUrlDTO): Promise<string> => {
  const slugRecord = await SlugRepository.findSlugBySlug(slug);

  if (!slugRecord) {
    return `${env('APP_FRONTEND_NOT_FOUND_URL')}?url=${env('BASE_URL')}/${slug}`;
  }

  await SlugRepository.incrementVisits(slug);
  return slugRecord.url
};

export const getUserSlugs = async ({ user }: slugsInterface.GetUserSlugsDTO): Promise<slugsInterface.SlugDTO[]> => {
  return await SlugRepository.findSlugsByUserId(user.id);
};

export const updateSlug = async ({ slug, newSlug }: slugsInterface.UpdateSlugDTO): Promise<void> => {
  const existingSlug = await SlugRepository.findSlugBySlug(newSlug);

  if (existingSlug) {
    throw new UnprocessableEntityError({ message: 'New slug already exists' });
  }

  await SlugRepository.updateSlug(slug, newSlug);
};

export const deleteSlug = async ({ slug }: slugsInterface.DeleteSluglDTO): Promise<number> => {
  return await SlugRepository.deleteSlug(slug);
};

const generateAutoSlug = async (url: string, userId: string): Promise<slugsInterface.SlugDTO> => {
  const slug = await generateSlug();
  const newSlug = await SlugRepository.createSlug(slug, url, userId);
  return newSlug;
}
