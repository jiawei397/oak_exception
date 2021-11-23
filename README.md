# oak_exception

[![Deno](https://github.com/jiawei397/oak_exception/actions/workflows/deno.yml/badge.svg)](https://github.com/jiawei397/oak_exception/actions/workflows/deno.yml)

A global exception filter middleware by oak.

## Example

```typescript
import { anyExceptionFilter } from "https://deno.land/x/oak_exception@v0.0.3/mod.ts";
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
```
