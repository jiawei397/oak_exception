// deno-lint-ignore-file no-explicit-any

export type MsgCallback = (...msg: unknown[]) => unknown;

export interface Logger {
  error: MsgCallback;
  warn: MsgCallback;

  info: MsgCallback;
  debug: MsgCallback;
}

export interface Context {
  request: Request;
  response: Response;
}

export interface Request {
  headers: Headers;
  [x: string]: any;
}

export interface Response {
  headers: Headers;
  [x: string]: any;
}

export type Middleware = (
  ctx: Context,
  next: () => Promise<unknown>,
) => Promise<unknown>;
