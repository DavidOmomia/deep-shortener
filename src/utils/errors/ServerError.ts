import { StatusCodes } from 'http-status-codes';
import { BaseError } from './BaseError';
import { ErrorProps } from './errorsInterface';
import { errorTypes, errorMessages } from './errorsConstants';

export class InternalServerError extends BaseError {
  constructor(props?: Partial<ErrorProps>) {
    super({
      message: props?.message || errorMessages.InternalServerErrorMessage,
      httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
      errorType: errorTypes.INTERNAL_SERVER_ERROR,
      verboseMessage: props?.verboseMessage,
    });
  }
}

export class ServiceUnavailableError extends BaseError {
  constructor(props?: Partial<ErrorProps>) {
    super({
      message: props?.message || errorMessages.serviceUnavailableErrorMessage,
      httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
      errorType: errorTypes.INTERNAL_SERVER_ERROR,
      verboseMessage: props?.verboseMessage,
    });
  }
}
