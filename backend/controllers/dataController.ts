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
import { BaseController } from "./baseController.ts";

// Create a new Oak application instance
const app = new Application();

// Create a new router instance
const router = new Router();

// Create a new PostgreSQL client instance
const client = new Client({
  user: Deno.env.get("DB_USER") || "user",
  database: Deno.env.get("DB_NAME") || "database",
  hostname: Deno.env.get("DB_HOST") || "localhost",
  password: Deno.env.get("DB_PASSWORD") || "password",
  port: parseInt(Deno.env.get("DB_PORT") || "5432"),
});

// Connect to the PostgreSQL database
await client.connect();

// Define the routes and their corresponding handler functions
router
  // Route to get all data
  // This route handles GET requests to /data and retrieves all data from the database
  .get("/data", async (ctx) => {
    await handleRequest(ctx, getAllData);
  })
  // Route to insert new data
  // This route handles POST requests to /data and inserts new data into the database
  .post("/data", async (ctx) => {
    await handleRequest(ctx, insertData);
  });

// Use the router middleware
app.use(router.routes());
app.use(router.allowedMethods());

// Start the server and listen on the specified port
const PORT = parseInt(Deno.env.get("PORT") || "8000");
console.log(`Server is running on port ${PORT}`);
await app.listen({ port: PORT });

/**
 * Handle the request and send the response
 * @param ctx - The context object containing request and response
 * @param serviceFunction - The service function to call
 * @param params - The parameters to pass to the service function
 */
async function handleRequest(ctx: any, serviceFunction: Function, ...params: any[]) {
  try {
    const { value } = await ctx.request.body();
    const result = await serviceFunction(...params, value);
    BaseController.sendJsonResponse(ctx, 200, result);
  } catch (error) {
    BaseController.handleError(ctx, error);
  }
}

/**
 * Get all data from the database
 * @returns The data retrieved from the database
 */
async function getAllData() {
  const result = await client.queryArray("SELECT * FROM data");
  return result.rows;
}

/**
 * Insert new data into the database
 * @param data - The data to insert
 */
async function insertData(data: any) {
  await client.queryArray("INSERT INTO data (name, value) VALUES ($1, $2)", data.name, data.value);
}
