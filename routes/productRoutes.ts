import { Router } from "https://deno.land/x/oak/mod.ts";
import { ProductController } from "../controllers/productController.ts";

// Create a new router instance
const router = new Router();

// Create a new instance of the ProductController
const productController = new ProductController();

// Define the routes and their corresponding controller methods
router
  // Route to get all products
  .get("/products", (ctx) => productController.getAllProducts(ctx))
  // Route to get a product by ID
  .get("/products/:id", (ctx) => productController.getProductById(ctx))
  // Route to create a new product
  .post("/products", (ctx) => productController.createProduct(ctx))
  // Route to update an existing product
  .put("/products/:id", (ctx) => productController.updateProduct(ctx))
  // Route to delete a product by ID
  .delete("/products/:id", (ctx) => productController.deleteProduct(ctx));

export default router;
