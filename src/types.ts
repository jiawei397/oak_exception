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
  state: Record<string | number | symbol, any>;
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
  /** if return true, then this request will be ignored */
  filter?: (context: Context) => boolean;
  get404Body?: (context: Context) => string | Promise<string>;
  messageOf404?: string;
  getErrorBody?: (
    err: Error & { status?: number },
    context: Context,
  ) => string | Promise<string>;
  defaultErrorStatus?: number;
};
