import { StatusCodes } from 'http-status-codes';
import { BaseError } from './BaseError';
import { ErrorProps } from './errorsInterface';
import { errorTypes, errorMessages } from './errorsConstants';

export class TooManyRequestsError extends BaseError {
  constructor(props?: Partial<ErrorProps>) {
    super({
      message: props?.message || errorMessages.TooManyRequestsErrorMessage,
      httpCode: StatusCodes.TOO_MANY_REQUESTS,
      errorType: errorTypes.TOO_MANY_REQUESTS,
      verboseMessage: props?.verboseMessage,
    });
  }
}
