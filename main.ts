/**
 * This file is the entry point of the application.
 * It sets up the Oak application, configures middleware, and defines routes.
 * The application listens on a specified port and handles incoming HTTP requests.
 * 
 * Configuration options:
 * - Application: The Oak application instance.
 * - Router: The Oak router instance.
 * - userRouter: The router for user-related routes.
 * - productRouter: The router for product-related routes.
 * - authMiddleware: The middleware for handling authentication.
 * - errorMiddleware: The middleware for handling errors.
 * - PORT: The port number on which the server listens.
 */

import { Application, Router } from "@oakserver/oak";

// The Application class is used to create a new Oak application
// The Router class is used to create a new router for handling routes
import { userRouter } from "./routes/userRoutes.ts";
import { productRouter } from "./routes/productRoutes.ts";
import { authMiddleware } from "./middlewares/authMiddleware.ts";
import { errorMiddleware } from "./middlewares/errorMiddleware.ts";

// Create a new Oak application instance
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
