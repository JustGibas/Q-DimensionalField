import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { Client } from "https://deno.land/x/postgres/mod.ts";

const app = new Application();
const router = new Router();

const client = new Client({
  user: Deno.env.get("DB_USER") || "user",
  database: Deno.env.get("DB_NAME") || "database",
  hostname: Deno.env.get("DB_HOST") || "localhost",
  password: Deno.env.get("DB_PASSWORD") || "password",
  port: parseInt(Deno.env.get("DB_PORT") || "5432"),
});

await client.connect();

router
  .get("/data", async (context) => {
    const result = await client.queryArray("SELECT * FROM data");
    context.response.body = result.rows;
  })
  .post("/data", async (context) => {
    const body = await context.request.body().value;
    await client.queryArray("INSERT INTO data (name, value) VALUES ($1, $2)", body.name, body.value);
    context.response.status = 201;
  });

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: parseInt(Deno.env.get("PORT") || "8000") });
