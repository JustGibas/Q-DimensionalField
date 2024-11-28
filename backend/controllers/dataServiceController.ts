/**
 * This file sets up the Oak application, configures middleware, and defines routes for data-related operations.
 * The application listens on a specified port and handles incoming HTTP requests.
 * 
 * Configuration options:
 * - Application: The Oak application instance.
 * - Router: The Oak router instance.
 * - Client: The PostgreSQL client instance.
 * - PORT: The port number on which the server listens.
 */

import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { Client } from "https://deno.land/x/postgres/mod.ts";

// Create a new Oak application instance
const app = new Application();
// Create a new router instance
const router = new Router();

// Create a new PostgreSQL client instance
const client = new Client({
  user: "user",
  database: "database",
  hostname: "localhost",
  password: "password",
  port: 5432,
});

// Connect to the PostgreSQL database
await client.connect();

// Define the routes and their corresponding controller functions
router
  // Route to get all data
  // This route handles GET requests to /data and retrieves all data from the database
  .get("/data", async (ctx) => {
    const result = await client.queryArray("SELECT * FROM data");
    ctx.response.body = result.rows;
  })
  // Route to insert new data
  // This route handles POST requests to /data and inserts new data into the database
  .post("/data", async (ctx) => {
    const { value } = await ctx.request.body().value;
    await client.queryArray("INSERT INTO data (name, value) VALUES ($1, $2)", value.name, value.value);
    ctx.response.status = 201;
  });

// Use the router middleware
app.use(router.routes());
app.use(router.allowedMethods());

// Start the server
const PORT = parseInt(Deno.env.get("PORT") || "8000");
console.log(`Server is running on port ${PORT}`);
await app.listen({ port: PORT });
