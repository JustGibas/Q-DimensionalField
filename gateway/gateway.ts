import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const app = new Application();
const router = new Router();

router
  .get("/auth", async (ctx) => {
    const response = await fetch("http://auth-service:8000" + ctx.request.url.pathname, {
      method: ctx.request.method,
      headers: ctx.request.headers,
      body: ctx.request.body().value,
    });
    ctx.response.status = response.status;
    ctx.response.body = await response.text();
  })
  .get("/data", async (ctx) => {
    const response = await fetch("http://data-service:8000" + ctx.request.url.pathname, {
      method: ctx.request.method,
      headers: ctx.request.headers,
      body: ctx.request.body().value,
    });
    ctx.response.status = response.status;
    ctx.response.body = await response.text();
  })
  .get("/navbar", async (ctx) => {
    const response = await fetch("http://navbar-service:3001" + ctx.request.url.pathname, {
      method: ctx.request.method,
      headers: ctx.request.headers,
      body: ctx.request.body().value,
    });
    ctx.response.status = response.status;
    ctx.response.body = await response.text();
  })
  .get("/main-menu", async (ctx) => {
    const response = await fetch("http://main-menu-service:3002" + ctx.request.url.pathname, {
      method: ctx.request.method,
      headers: ctx.request.headers,
      body: ctx.request.body().value,
    });
    ctx.response.status = response.status;
    ctx.response.body = await response.text();
  })
  .get("/3d-engine", async (ctx) => {
    const response = await fetch("http://3d-engine-service:3003" + ctx.request.url.pathname, {
      method: ctx.request.method,
      headers: ctx.request.headers,
      body: ctx.request.body().value,
    });
    ctx.response.status = response.status;
    ctx.response.body = await response.text();
  });

app.use(router.routes());
app.use(router.allowedMethods());

const PORT = parseInt(Deno.env.get("PORT") || "8000");
await app.listen({ port: PORT });
