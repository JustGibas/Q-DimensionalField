import { Router } from "https://deno.land/x/oak/mod.ts";
import { ProductController } from "../controllers/productController.ts";

const router = new Router();
const productController = new ProductController();

router
  .get("/products", (ctx) => productController.getAllProducts(ctx))
  .get("/products/:id", (ctx) => productController.getProductById(ctx))
  .post("/products", (ctx) => productController.createProduct(ctx))
  .put("/products/:id", (ctx) => productController.updateProduct(ctx))
  .delete("/products/:id", (ctx) => productController.deleteProduct(ctx));

export default router;
