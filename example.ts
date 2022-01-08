import { anyExceptionFilter, ForbiddenException } from "./mod.ts";
import { Application } from "https://deno.land/x/oak@v10.0.0/mod.ts";

const app = new Application();
app.use(anyExceptionFilter({
  isLogCompleteError: true,
}));

// other middleware

app.use((_ctx) => {
  // throw new Error("500");
  throw new ForbiddenException("403 error");
  // ctx.response.body = new ForbiddenException("403 error");
  // ctx.response.body = "Hello World!";
});

console.log("app started with: http://localhost");
await app.listen(":80");
