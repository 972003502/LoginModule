import { ResponseBody } from './ResponseBody';

export class ErrorResponse implements Error {
  constructor(
    readonly url: string,
    readonly error: ResponseBody,
    ) {}
  readonly name = 'ErrorResponse';
  readonly status = this.error.status;
  readonly statusText = this.error.statusText;
  readonly message = this.error.message;
  readonly ok = false;
}
