import httpStatusCodes from "http-status-codes";

export interface IErrorResponse {
  message: string;
  statusCode: number;
  status: string;
  serializeError(): IError;
}

export interface IError {
  message: string;
  statusCode: number;
  status: string;
}

export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract status: string;

  constructor(message: string) {
    super(message);
  }

  serializeError(): IError {
    return {
      message: this.message,
      statusCode: this.statusCode,
      status: this.status
    };
  }
}

export class JoiRequestValidationError extends CustomError {
  statusCode: number = httpStatusCodes.BAD_REQUEST;
  status: string = "error";
  constructor(message: string) {
    super(message);
  }
}

export class BadRequestError extends CustomError {
  statusCode: number = httpStatusCodes.BAD_REQUEST;
  status: string = "error";

  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends CustomError {
  statusCode: number = httpStatusCodes.NOT_FOUND;
  status: string = "error";

  constructor(message: string) {
    super(message);
  }
}

export class UnAuthorizedError extends CustomError {
  statusCode: number = httpStatusCodes.UNAUTHORIZED;
  status: string = "error";
  constructor(message: string) {
    super(message);
  }
}

export class FileTooLargeError extends CustomError {
  statusCode: number = httpStatusCodes.REQUEST_TOO_LONG;
  status: string = "error";
  constructor(message: string) {
    super(message);
  }
}

export class ServerError extends CustomError {
  statusCode: number = httpStatusCodes.SERVICE_UNAVAILABLE;
  status: string = "error";
  constructor(message: string) {
    super(message);
  }
}
