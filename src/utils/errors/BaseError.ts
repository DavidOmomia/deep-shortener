import { ErrorProps } from './errorsInterface';
import { logger } from '../logger';
import { errorTypes, errorMessages } from './errorsConstants';
import { StatusCodes } from 'http-status-codes';

export class BaseError extends Error {
  public httpCode: number;
  public verboseMessage: any;
  public errorType?: string;
  public message: string;

  constructor({ message, httpCode, verboseMessage, errorType }: ErrorProps) {
    super(message);
    this.name = this.constructor.name;
    this.httpCode = httpCode || StatusCodes.INTERNAL_SERVER_ERROR;
    this.message = message || errorMessages.InternalServerErrorMessage;
    this.verboseMessage = verboseMessage;
    this.errorType = errorType || errorTypes.INTERNAL_SERVER_ERROR;

    const errorMessage = `**Error encountered!**\n- Error type: ${this.errorType}\n- Message: ${this.message}\n- HTTP code: ${this.httpCode}\n- Verbose message: ${this.verboseMessage}\n`;
    logger.error(errorMessage);
    logger.error(this);
  }
}
