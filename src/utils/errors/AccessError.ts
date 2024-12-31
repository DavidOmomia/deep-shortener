import { StatusCodes } from 'http-status-codes';
import { BaseError } from './BaseError';
import { ErrorProps } from './errorsInterface';
import { errorTypes, errorMessages } from './errorsConstants';

export class AccessDeniedError extends BaseError {
  constructor(props?: Partial<ErrorProps>) {
    super({
      message: props?.message || errorMessages.accessDeniedErrorMessage,
      httpCode: StatusCodes.FORBIDDEN,
      errorType: errorTypes.ACCESS_DENIED,
      verboseMessage: props?.verboseMessage,
    });
  }
}

export class RequestedResourceDeniedError extends BaseError {
  constructor(props?: Partial<ErrorProps>) {
    super({
      message: props?.message || errorMessages.requestedResourceDeniedErrorMessage,
      httpCode: StatusCodes.FORBIDDEN,
      errorType: errorTypes.ACCESS_DENIED,
      verboseMessage: props?.verboseMessage,
    });
  }
}

export class UpdateAccessDeniedError extends BaseError {
  constructor(props?: Partial<ErrorProps>) {
    super({
      message: props?.message || errorMessages.updateAccessDeniedErrorMessage,
      httpCode: StatusCodes.FORBIDDEN,
      errorType: errorTypes.ACCESS_DENIED,
      verboseMessage: props?.verboseMessage,
    });
  }
}

export class DeleteAccessDeniedError extends BaseError {
  constructor(props?: Partial<ErrorProps>) {
    super({
      message: props?.message || errorMessages.deleteAccessDeniedErrorMessage,
      httpCode: StatusCodes.FORBIDDEN,
      errorType: errorTypes.ACCESS_DENIED,
      verboseMessage: props?.verboseMessage,
    });
  }
}

export class AuthenticationError extends BaseError {
  constructor(props?: Partial<ErrorProps>) {
    super({
      message: props?.message || errorMessages.authenticationErrorMessage,
      httpCode: StatusCodes.UNAUTHORIZED,
      errorType: errorTypes.USER_AUTHENTICATION_FALSE,
      verboseMessage: props?.verboseMessage,
    });
  }
}
