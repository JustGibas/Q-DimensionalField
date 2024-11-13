import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const app = new Application();
const router = new Router();

router
  .all("/auth(.*)", async (ctx) => {
    const response = await fetch("http://auth-service:8000" + ctx.request.url.pathname, {
      method: ctx.request.method,
      headers: ctx.request.headers,
      body: ctx.request.body().value,
    });
    ctx.response.status = response.status;
    ctx.response.body = await response.text();
  })
  .all("/data(.*)", async (ctx) => {
    const response = await fetch("http://data-service:8000" + ctx.request.url.pathname, {
      method: ctx.request.method,
      headers: ctx.request.headers,
      body: ctx.request.body().value,
    });
    ctx.response.status = response.status;
    ctx.response.body = await response.text();
  });

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
