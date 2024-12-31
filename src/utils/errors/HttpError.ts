import { StatusCodes } from 'http-status-codes';
import { BaseError } from './BaseError';
import { ErrorProps } from './errorsInterface';
import { errorTypes, errorMessages } from './errorsConstants';

export class HttpError extends BaseError {
  constructor(props?: Partial<ErrorProps>) {
    super({
      message: props?.message || errorMessages.httpErrorMessage,
      httpCode: StatusCodes.CONFLICT,
      errorType: errorTypes.HTTP_ERROR,
      verboseMessage: props?.verboseMessage,
    });
  }
}

export class HttpConnectionError extends BaseError {
  constructor(props?: Partial<ErrorProps>) {
    super({
      message: props?.message || errorMessages.httpConnectionErrorMessage,
      httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
      errorType: errorTypes.HTTP_CONNECTION_ERROR,
      verboseMessage: props?.verboseMessage,
    });
  }
}
