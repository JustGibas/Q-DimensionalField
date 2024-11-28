/**
 * This file contains the gateway setup for the application.
 * It defines the routes for various services and proxies the requests to the respective services.
 * The gateway uses Oak framework for handling HTTP requests.
 */

import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const app = new Application();
const router = new Router();

/**
 * Proxy request to the authentication service
 * @param ctx - The context object containing request and response
 */
router.get("/auth", async (ctx) => {
  const response = await fetch("http://auth-service:8000" + ctx.request.url.pathname, {
    method: ctx.request.method,
    headers: ctx.request.headers,
    body: ctx.request.body().value,
  });
  ctx.response.status = response.status;
  ctx.response.body = await response.text();
});

/**
 * Proxy request to the data service
 * @param ctx - The context object containing request and response
 */
router.get("/data", async (ctx) => {
  const response = await fetch("http://data-service:8000" + ctx.request.url.pathname, {
    method: ctx.request.method,
    headers: ctx.request.headers,
    body: ctx.request.body().value,
  });
  ctx.response.status = response.status;
  ctx.response.body = await response.text();
});

/**
 * Proxy request to the navbar service
 * @param ctx - The context object containing request and response
 */
router.get("/navbar", async (ctx) => {
  const response = await fetch("http://navbar-service:3001" + ctx.request.url.pathname, {
    method: ctx.request.method,
    headers: ctx.request.headers,
    body: ctx.request.body().value,
  });
  ctx.response.status = response.status;
  ctx.response.body = await response.text();
});

/**
 * Proxy request to the main menu service
 * @param ctx - The context object containing request and response
 */
router.get("/main-menu", async (ctx) => {
  const response = await fetch("http://main-menu-service:3002" + ctx.request.url.pathname, {
    method: ctx.request.method,
    headers: ctx.request.headers,
    body: ctx.request.body().value,
  });
  ctx.response.status = response.status;
  ctx.response.body = await response.text();
});

/**
 * Proxy request to the 3D engine service
 * @param ctx - The context object containing request and response
 */
router.get("/3d-engine", async (ctx) => {
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

await app.listen({ port: 8000 });
