/**
 * This file defines the main router for the backend.
 * It imports and uses the user and product routes.
 * The router is then exported for use in the server setup.
 */

import { Router } from "@oakserver/oak";
import userRoutes from "./routes/userRoutes.ts";
import productRoutes from "./routes/productRoutes.ts";

const router = new Router();

router.use(userRoutes.routes());
router.use(userRoutes.allowedMethods());
router.use(productRoutes.routes());
router.use(productRoutes.allowedMethods());

export default router;
