import { StatusCodes } from 'http-status-codes';
import { BaseError } from './BaseError';
import { ErrorProps } from './errorsInterface';
import { errorTypes, errorMessages } from './errorsConstants';

export class ResourceNotFoundError extends BaseError {
  constructor(props?: Partial<ErrorProps>) {
    super({
      message: props?.message || errorMessages.resourceNotFoundErrorMessage,
      httpCode: StatusCodes.NOT_FOUND,
      errorType: errorTypes.RESOURCE_NOT_FOUND,
      verboseMessage: props?.verboseMessage,
    });
  }
}

export class ResourceExistError extends BaseError {
  constructor(props?: Partial<ErrorProps>) {
    super({
      message: props?.message || errorMessages.resourceExistErrorMessage,
      httpCode: StatusCodes.CONFLICT,
      errorType: errorTypes.RESOURCE_EXIST,
      verboseMessage: props?.verboseMessage,
    });
  }
}
