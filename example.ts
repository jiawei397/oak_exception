import { anyExceptionFilter } from "./mod.ts";
import { Application } from "https://deno.land/x/oak@v10.0.0/mod.ts";

const app = new Application();
app.use(anyExceptionFilter());

// other middleware

app.use((ctx) => {
  throw new Error("500");
  ctx.response.body = "Hello World!";
});

console.log("app started with: http://localhost");
await app.listen(":80");
