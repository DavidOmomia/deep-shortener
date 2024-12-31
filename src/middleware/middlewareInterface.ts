import { Request, Response, NextFunction, Router } from 'express';
import { UserDTO } from '../modules/users/usersInterface';

export interface APIHelperDTO {
  req: MyRequest;
  res: Response<any, Record<string, any>>;
  controller: Function;
  expectPayload?: boolean;
}

export interface MyRequest extends Request {
  user?: UserDTO | null;
}
