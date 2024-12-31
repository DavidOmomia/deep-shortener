import { StatusCodes } from 'http-status-codes';
import { BaseError } from './BaseError';
import { ErrorProps } from './errorsInterface';
import { errorTypes, errorMessages } from './errorsConstants';

export class OperationForbiddenError extends BaseError {
  constructor(props?: Partial<ErrorProps>) {
    super({
      message: props?.message || errorMessages.operationForbiddenErrorMessage,
      httpCode: StatusCodes.FORBIDDEN,
      errorType: errorTypes.OPERATION_FORBIDDEN,
      verboseMessage: props?.verboseMessage,
    });
  }
}
