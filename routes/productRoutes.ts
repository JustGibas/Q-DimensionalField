/**
 * This file contains the routes related to products.
 * It defines the endpoints for CRUD operations on products and maps them to the corresponding controller methods.
 * 
 * Configuration options:
 * - Router: The Oak router instance.
 * - ProductController: The controller class for handling product-related operations.
 * - ctx: The context object containing request and response.
 */

import { Router } from "@oakserver/oak";
import { ProductController } from "../controllers/productController.ts";

// Create a new router instance
const router = new Router();

// Create a new instance of the ProductController
const productController = new ProductController();

// Define the routes and their corresponding controller methods
router
  // Route to get all products
  // This route handles GET requests to /products and calls the getAllProducts method of the ProductController
  .get("/products", (ctx) => productController.getAllProducts(ctx))
  // Route to get a product by ID
  // This route handles GET requests to /products/:id and calls the getProductById method of the ProductController
  .get("/products/:id", (ctx) => productController.getProductById(ctx))
  // Route to create a new product
  // This route handles POST requests to /products and calls the createProduct method of the ProductController
  .post("/products", (ctx) => productController.createProduct(ctx))
  // Route to update an existing product
  // This route handles PUT requests to /products/:id and calls the updateProduct method of the ProductController
  .put("/products/:id", (ctx) => productController.updateProduct(ctx))
  // Route to delete a product by ID
  // This route handles DELETE requests to /products/:id and calls the deleteProduct method of the ProductController
  .delete("/products/:id", (ctx) => productController.deleteProduct(ctx));

export default router;
