import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { Client } from "https://deno.land/x/postgres/mod.ts";
import { validate, sanitize } from "https://deno.land/x/validator/mod.ts";

const app = new Application();
const router = new Router();

const client = new Client({
  user: Deno.env.get("DB_USER") || "user",
  database: Deno.env.get("DB_NAME") || "database",
  hostname: Deno.env.get("DB_HOST") || "localhost",
  password: Deno.env.get("DB_PASSWORD") || "password",
  port: Number(Deno.env.get("DB_PORT")) || 5432,
});

await client.connect();

router
  .get("/data", async (context) => {
    const result = await client.queryArray("SELECT * FROM data");
    context.response.body = result.rows;
  })
  .post("/data", async (context) => {
    const body = await context.request.body().value;
    const sanitizedBody = {
      name: sanitize(body.name),
      value: sanitize(body.value),
    };
    if (!validate(sanitizedBody.name, { isLength: { min: 1 } }) || !validate(sanitizedBody.value, { isLength: { min: 1 } })) {
      context.response.status = 400;
      context.response.body = { message: "Invalid input data" };
      return;
    }
    await client.queryArray("INSERT INTO data (name, value) VALUES ($1, $2)", sanitizedBody.name, sanitizedBody.value);
    context.response.status = 201;
  });

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
