import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction, Router } from 'express';
import { env, logger, UnprocessableEntityError, InternalServerError, AuthenticationError, TooManyRequestsError } from '../utils';
import { ErrorProps } from '../utils/errors/errorsInterface';
import { APIHelperDTO, MyRequest } from './middlewareInterface';
import { UserRepository } from '../modules/users/usersRepository';
import rateLimit from 'express-rate-limit';

export const APIRouter = (): Router => Router();

export const APIHelper = async (params: APIHelperDTO): Promise<any> => {
  const { req, res, controller, expectPayload = true } = params;
  try {
    const payload = extractPayload(req);
    validatePayload(payload, expectPayload);

    const { data, message, statusCode = 200, redirectUrl = null } = await controller(payload);
    logRequest(req, controller.name, payload, message);

    if (redirectUrl) {
      return res.redirect(statusCode, redirectUrl);
    }

    return res.status(statusCode).json({
      data: data ? data : [],
      meta: {
        message,
      },
    });
  } catch (error: any) {
    logError(req, controller.name, error);
    return handleHttpError(res, error);
  }
};

const extractPayload = (req: MyRequest) => {
  if (typeof req.body !== 'undefined' && Array.isArray(req.body)) {
    throw new UnprocessableEntityError({
      message: 'Request body must be of type object',
    });
  }

  const payload = Object.assign({}, req.body, req.params, req.query);
  if (req.user) {
    payload.user = req.user;
  }
  return payload;
};

const validatePayload = (payload: any, expectPayload: boolean) => {
  if (expectPayload && Object.keys(payload).length <= 0) {
    throw new UnprocessableEntityError({
      message: 'No payload sent',
    });
  }
};

const logRequest = (req: Request, functionName: string, payload: any, message: string) => {
  logger.info({
    message,
    data: payload,
    httpPath: req.path,
    httpMethod: req.method,
    function: functionName,
  });
};

const logError = (req: Request, functionName: string, error: any) => {
  logger.error({
    message: error.message,
    error,
    httpPath: req.path,
    httpMethod: req.method,
    function: functionName,
  });
};

export const handleHttpError = (res: Response, error: ErrorProps | null = null) => {
  if (error === null) {
    error = new InternalServerError();
  }
  return res.status(error.httpCode || 500).json({
    errors: [
      {
        status: error.httpCode || 500,
        title: error.message,
        detail: error.verboseMessage,
      },
    ],
  });
};

export const authenticateUser = async (req: MyRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return handleHttpError(
      res,
      new AuthenticationError({
        message: 'No token provided',
      }),
    );
  }

  const token = authHeader.split(' ')[1];

  try {
    const jwtSecret = env('JWT_SECRET');
    const decoded: any = jwt.verify(token, jwtSecret);
    const user = await UserRepository.findUserById(decoded.userId);

    if (!user) {
      return handleHttpError(res, new AuthenticationError());
    }

    req.user = user.toJSON();
    next();
  } catch (error) {
    return handleHttpError(
      res,
      new AuthenticationError({
        message: 'Invalid token',
      }),
    );
  }
};

export const rateLimiter = rateLimit({
  windowMs: +env('RATE_LIMIT_WINDOW_IN_MS'),
  max: +env('RATE_LIMIT_MAX_REQUESTS'),
  handler: (req: Request, res: Response) => {
    const error = new TooManyRequestsError();
    handleHttpError(res, error);
  },
});
