import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { Client } from "https://deno.land/x/postgres/mod.ts";

const app = new Application();
const router = new Router();

const client = new Client({
  user: "user",
  database: "database",
  hostname: "localhost",
  password: "password",
  port: 5432,
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

await app.listen({ port: 8000 });
