/**
 * This file contains the main router configuration for the application.
 * It imports and uses the userRoutes and productRoutes to define the endpoints for user and product-related operations.
 * 
 * Configuration options:
 * - Router: The Oak router instance.
 * - userRoutes: The router for user-related routes.
 * - productRoutes: The router for product-related routes.
 */

import { Router } from "@oakserver/oak";
import userRoutes from "./routes/userRoutes.ts";
import productRoutes from "./routes/productRoutes.ts";

// Create a new router instance
const router = new Router();

// Use the userRoutes and productRoutes
router.use(userRoutes.routes());
router.use(userRoutes.allowedMethods());
router.use(productRoutes.routes());
router.use(productRoutes.allowedMethods());

export default router;
