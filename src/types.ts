// deno-lint-ignore-file no-explicit-any

export type MsgCallback = (...msg: unknown[]) => unknown;

export interface Logger {
  error: MsgCallback;
  warn: MsgCallback;

  info: MsgCallback;
  debug: MsgCallback;
}

export interface Request {
  headers: Headers;
  [x: string]: any;
}

export interface Response {
  headers: Headers;
  [x: string]: any;
}

export interface Context {
  request: Request;
  response: Response;
}

export type Middleware = (
  ctx: Context,
  next: () => Promise<unknown>,
) => Promise<unknown>;

export type ExceptionOptions = {
  logger?: Logger;
  isHeaderResponseTime?: boolean;
  isDisableFormat404?: boolean;
  isLogCompleteError?: boolean;
  get404Body?: (context: Context) => string;
  messageOf404?: string;
  getErrorBody?: (err: Error, context: Context) => string;
  defaultErrorStatus?: number;
};
