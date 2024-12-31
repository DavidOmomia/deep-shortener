import Joi from 'joi';

export const createShortenedUrlSchema = Joi.object({
  url: Joi.string().required(),
  user: Joi.object().required(),
  slug: Joi.string().optional(),
});

export const getOriginalUrlSchema = Joi.object({
  slug: Joi.string().required(),
});

export const getUserSlugsSchema = Joi.object({
  user: Joi.object().required(),
});

export const updateSlugSchema = Joi.object({
  slug: Joi.string().required(),
  newSlug: Joi.string().required(),
  user: Joi.object().required(),
});

export const deleteSlugSchema = Joi.object({
  slug: Joi.string().required(),
  user: Joi.object().required(),
});
