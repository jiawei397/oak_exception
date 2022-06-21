// Copyright 2020 the oak authors. All rights reserved. MIT license.

import type { Context } from "./types.ts";
import {
  assert,
  assertEquals,
  beforeEach,
  describe,
  it,
} from "../test_deps.ts";
import { anyExceptionFilter, get404Message } from "./exception.ts";

describe("isHeaderResponseTime", () => {
  let mockContext: Context, mockNext: () => Promise<unknown>;

  beforeEach(() => {
    mockContext = {
      response: {
        headers: new Headers(),
        status: 200,
      },
      request: {
        method: "GET",
        url: "https://www.baidu.com",
      },
    } as unknown as Context;
    mockNext = () => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 50);
      });
    };
  });

  it("no response", async () => {
    await anyExceptionFilter()(mockContext, mockNext);
    assertEquals(mockContext.response.headers.has("x-response-time"), false);
  });

  it("has response", async () => {
    await anyExceptionFilter({
      isHeaderResponseTime: true,
    })(mockContext, mockNext);
    assertEquals(mockContext.response.headers.has("x-response-time"), true);
    const value = parseInt(
      mockContext.response.headers.get("x-response-time")!,
      10,
    );
    assert(value >= 50);
  });
});

describe("status", () => {
  let mockContext: Context, mockNext: () => Promise<unknown>;

  beforeEach(() => {
    mockNext = () => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 0);
      });
    };
  });

  it("404 without body", async () => {
    mockContext = {
      response: {
        headers: new Headers(),
        status: 404,
      },
      request: {
        method: "GET",
        url: "https://www.baidu.com/404",
      },
    } as unknown as Context;

    await anyExceptionFilter()(mockContext, mockNext);
    assertEquals(mockContext.response.status, 404);
    assertEquals(mockContext.response.body, get404Message());
  });

  it("404 without body and disbale deal 404", async () => {
    mockContext = {
      response: {
        headers: new Headers(),
        status: 404,
      },
      request: {
        method: "GET",
        url: "https://www.baidu.com/404",
      },
    } as unknown as Context;

    await anyExceptionFilter({
      isDisableFormat404: true,
    })(mockContext, mockNext);
    assertEquals(mockContext.response.status, 404);
    assertEquals(mockContext.response.body, undefined);
  });

  it("404 with body", async () => {
    mockContext = {
      response: {
        headers: new Headers(),
        status: 404,
        body: "test",
      },
      request: {
        method: "GET",
        url: "https://www.baidu.com/404",
      },
    } as unknown as Context;

    await anyExceptionFilter()(mockContext, mockNext);
    assertEquals(mockContext.response.status, 404);
    assertEquals(mockContext.response.body, "test");
  });

  it("404 use self message", async () => {
    mockContext = {
      response: {
        headers: new Headers(),
        status: 404,
      },
      request: {
        method: "GET",
        url: "https://www.baidu.com/404",
      },
    } as unknown as Context;

    await anyExceptionFilter({
      messageOf404: "self message",
    })(mockContext, mockNext);
    assertEquals(mockContext.response.status, 404);
    assertEquals(mockContext.response.body, "self message");
  });

  it("404 use self message function", async () => {
    mockContext = {
      response: {
        headers: new Headers(),
        status: 404,
      },
      request: {
        method: "GET",
        url: "https://www.baidu.com/404",
      },
    } as unknown as Context;

    await anyExceptionFilter({
      get404Body: () => "self message",
    })(mockContext, mockNext);
    assertEquals(mockContext.response.status, 404);
    assertEquals(mockContext.response.body, "self message");
  });

  it("400", async () => {
    mockContext = {
      response: {
        headers: new Headers(),
        status: 400,
      },
      request: {
        method: "POST",
        url: "https://www.baidu.com/400",
      },
    } as unknown as Context;

    await anyExceptionFilter()(mockContext, mockNext);
    assertEquals(mockContext.response.status, 400);
  });

  it("next error with status", async () => {
    mockContext = {
      response: {
        headers: new Headers(),
        status: 501,
      },
      request: {
        method: "POST",
        url: "https://www.baidu.com/501",
      },
    } as unknown as Context;

    mockNext = () => {
      return new Promise<void>((_resolve, reject) => {
        setTimeout(() => {
          reject({
            msg: "error message",
            status: 502,
          });
        }, 0);
      });
    };

    await anyExceptionFilter()(mockContext, mockNext);
    assertEquals(mockContext.response.status, 502);
  });

  it("next error without status", async () => {
    mockContext = {
      response: {
        headers: new Headers(),
        status: 501,
      },
      request: {
        method: "POST",
        url: "https://www.baidu.com/501",
      },
    } as unknown as Context;

    mockNext = () => {
      return new Promise<void>((_resolve, reject) => {
        setTimeout(() => {
          reject("error");
        }, 0);
      });
    };

    await anyExceptionFilter()(mockContext, mockNext);
    assertEquals(mockContext.response.status, 500);
  });

  it("next error without status but set default status", async () => {
    mockContext = {
      response: {
        headers: new Headers(),
        status: 501,
      },
      request: {
        method: "POST",
        url: "https://www.baidu.com/501",
      },
    } as unknown as Context;

    mockNext = () => {
      return new Promise<void>((_resolve, reject) => {
        setTimeout(() => {
          reject("error");
        }, 0);
      });
    };

    await anyExceptionFilter({
      defaultErrorStatus: 400,
    })(mockContext, mockNext);
    assertEquals(mockContext.response.status, 400);
  });

  it("next error with status and self message", async () => {
    mockContext = {
      response: {
        headers: new Headers(),
      },
      request: {
        method: "POST",
        url: "https://www.baidu.com/501",
      },
    } as unknown as Context;

    mockNext = () => {
      return new Promise<void>((_resolve, reject) => {
        setTimeout(() => {
          reject({
            msg: "error message",
          });
        }, 0);
      });
    };

    await anyExceptionFilter({
      getErrorBody() {
        return "self error";
      },
    })(mockContext, mockNext);
    assertEquals(mockContext.response.body, "self error");
  });
});
