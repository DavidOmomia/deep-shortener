import { validate } from '../../utils';
import * as slugsInterface from './slugsInterface';
import * as slugsValidation from './slugsValidation';
import * as slugsConstants from './slugsConstants';
import * as slugsService from './slugsService';

export const shortenUrl = async (params: slugsInterface.CreateShortenedUrlDTO) => {
  const value = validate(params, slugsValidation.createShortenedUrlSchema);
  const data: slugsInterface.SlugDTO = await slugsService.createShortenedUrl(value);

  return {
    data,
    message: slugsConstants.slugCreationSuccessful,
    statusCode: 201,
  };
};

export const redirectUrl = async (params: slugsInterface.GetOriginalUrlDTO) => {
  const value = validate(params, slugsValidation.getOriginalUrlSchema);
  const data = await slugsService.getOriginalUrl(value);

  return {
    redirectUrl: data,
    statusCode: 302,
  };
};

export const getUserUrls = async (params: slugsInterface.GetUserSlugsDTO) => {
  const value = validate(params, slugsValidation.getUserSlugsSchema);
  const data = await slugsService.getUserSlugs(value);

  return {
    data,
    message: slugsConstants.getUserUrlsSuccessful,
  };
};

export const modifySlug = async (params: slugsInterface.UpdateSlugDTO) => {
  const value = validate(params, slugsValidation.updateSlugSchema);
  const data = await slugsService.updateSlug(value);

  return {
    data,
    message: slugsConstants.updateSlugSuccessful,
  };
};

export const deleteSlug = async (params: slugsInterface.DeleteSluglDTO) => {
  const value = validate(params, slugsValidation.deleteSlugSchema);
  await slugsService.deleteSlug(value);

  return {
    message: slugsConstants.deleteSlugSuccessful,
  };
};