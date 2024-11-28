/**
 * This file sets up the Oak application, configures routes for data-related operations,
 * and starts the server to listen for incoming HTTP requests.
 * 
 * Configuration options:
 * - Application: The Oak application instance.
 * - Router: The Oak router instance.
 * - Client: The PostgreSQL client instance.
 * - user: The username for the PostgreSQL database.
 * - database: The name of the PostgreSQL database.
 * - hostname: The hostname of the PostgreSQL server.
 * - password: The password for the PostgreSQL database.
 * - port: The port number on which the PostgreSQL server listens.
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

// Define the routes and their corresponding handler functions
router
  // Route to get all data
  // This route handles GET requests to /data and retrieves all data from the database
  .get("/data", async (context) => {
    try {
      const result = await client.queryArray("SELECT * FROM data");
      context.response.body = result.rows;
    } catch (error) {
      context.response.status = 500;
      context.response.body = { message: "Failed to fetch data", error: error.message };
    }
  })
  // Route to insert new data
  // This route handles POST requests to /data and inserts new data into the database
  .post("/data", async (context) => {
    try {
      const body = await context.request.body().value;
      await client.queryArray("INSERT INTO data (name, value) VALUES ($1, $2)", body.name, body.value);
      context.response.status = 201;
    } catch (error) {
      context.response.status = 500;
      context.response.body = { message: "Failed to insert data", error: error.message };
    }
  });

// Use the router middleware
app.use(router.routes());
app.use(router.allowedMethods());

// Start the server and listen on the specified port
const PORT = parseInt(Deno.env.get("PORT") || "8000");
console.log(`Server is running on port ${PORT}`);
await app.listen({ port: PORT });
