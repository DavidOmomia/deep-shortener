import { UserDTO } from '../users/usersInterface';

export interface CreateShortenedUrlDTO {
  url: string;
  user: UserDTO;
  slug?: string;
}

export interface SlugDTO {
  id: string;
  slug: string;
  url: string;
  userId: string;
  visits: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetOriginalUrlDTO {
  slug: string;
}

export interface GetUserSlugsDTO {
  user: UserDTO;
}

export interface UpdateSlugDTO {
  slug: string;
  newSlug: string;
  user: UserDTO;
}

export interface DeleteSluglDTO {
  slug: string;
  user: UserDTO;
}
