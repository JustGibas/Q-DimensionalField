/**
 * This file sets up the Oak application and starts the server to listen for incoming HTTP requests.
 * 
 * Configuration options:
 * - Application: The Oak application instance.
 * - PORT: The port number on which the server listens.
 */

import { Application } from "https://deno.land/x/oak/mod.ts";
import router from "../routes.ts";

// Create a new Oak application instance
const app = new Application();

// Use the router middleware
app.use(router.routes());
app.use(router.allowedMethods());

// Start the server and listen on the specified port
const PORT = parseInt(Deno.env.get("PORT") || "8000");
console.log(`Server is running on port ${PORT}`);
await app.listen({ port: PORT });
