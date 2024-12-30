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
import { UserController } from "./controllers/userController.ts";
import { ProductController } from "./controllers/productController.ts";
import { handleRequest, getAllData, insertData } from "./controllers/dataController.ts";
import { ProductService } from "./services/productService.ts";
import { UserService } from "./services/userService.ts";

// Create a new router instance
const router = new Router();

// Create a new instance of the UserController and ProductController
const userController = new UserController();
const productController = new ProductController();

// Define the routes and their corresponding controller methods
router
  // User routes
  .get("/users/:id", async (ctx) => await userController.getUser(ctx))
  .post("/users", async (ctx) => await userController.addUser(ctx))
  .put("/users/:id", async (ctx) => await userController.updateUser(ctx))
  .delete("/users/:id", async (ctx) => await userController.deleteUser(ctx))
  // Product routes
  .get("/products", async (ctx) => await productController.getAllProducts(ctx))
  .get("/products/:id", async (ctx) => await productController.getProductById(ctx))
  .post("/products", async (ctx) => await productController.createProduct(ctx))
  .put("/products/:id", async (ctx) => await productController.updateProduct(ctx))
  .delete("/products/:id", async (ctx) => await productController.deleteProduct(ctx))
  // Data routes
  .get("/data", async (ctx) => await handleRequest(ctx, getAllData))
  .post("/data", async (ctx) => await handleRequest(ctx, insertData));

// Use the userRoutes and productRoutes
router.use(userRoutes.routes());
router.use(userRoutes.allowedMethods());
router.use(productRoutes.routes());
router.use(productRoutes.allowedMethods());

export default router;
