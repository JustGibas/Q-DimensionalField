/**
 * This file is the entry point of the application.
 * It sets up the Oak application, configures middleware, and defines routes.
 * The application listens on a specified port and handles incoming HTTP requests.
 */

import { Application, Router } from "https://deno.land/x/oak/mod.ts";

// The Application class is used to create a new Oak application
// The Router class is used to create a new router for handling routes
import { userRouter } from "./routes/userRoutes.ts";
import { productRouter } from "./routes/productRoutes.ts";
import { authMiddleware } from "./middlewares/authMiddleware.ts";
import { errorMiddleware } from "./middlewares/errorMiddleware.ts";

const app = new Application();

// Middleware setup
// The authMiddleware is used to handle authentication for incoming requests
app.use(authMiddleware);
// The errorMiddleware is used to handle errors that occur during request processing
app.use(errorMiddleware);

// Routes setup
// The userRouter handles routes related to user operations
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());
// The productRouter handles routes related to product operations
app.use(productRouter.routes());
app.use(productRouter.allowedMethods());

// Start the server
const PORT = 8000;
console.log(`Server is running on port ${PORT}`);
await app.listen({ port: PORT });
