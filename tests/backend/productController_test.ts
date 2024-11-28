import { assertEquals, assertNotEquals } from "https://deno.land/std@0.205.0/testing/asserts.ts";
import { ProductController } from "../../backend/controllers/productController.ts";
import { ProductService } from "../../backend/services/productService.ts";

Deno.test("ProductController: Get All Products", async () => {
  const productService = new ProductService();
  const productController = new ProductController();

  const ctx = {
    response: {
      body: null,
      status: null,
    },
  };

  await productController.getAllProducts(ctx);
  assertEquals(ctx.response.status, 200);
  assertEquals(ctx.response.body, []);
});

Deno.test("ProductController: Get Product By ID", async () => {
  const productService = new ProductService();
  const productController = new ProductController();

  const newProduct = {
    id: "1",
    name: "Test Product",
    price: 100,
    description: "This is a test product",
  };

  await productService.createProduct(newProduct);

  const ctx = {
    params: { id: "1" },
    response: {
      body: null,
      status: null,
    },
  };

  await productController.getProductById(ctx);
  assertEquals(ctx.response.status, 200);
  assertEquals(ctx.response.body, newProduct);
});

Deno.test("ProductController: Create Product", async () => {
  const productController = new ProductController();

  const ctx = {
    request: {
      body: async () => ({
        value: {
          name: "New Product",
          price: 200,
          description: "This is a new product",
        },
      }),
    },
    response: {
      body: null,
      status: null,
    },
  };

  await productController.createProduct(ctx);
  assertEquals(ctx.response.status, 201);
  assertEquals(ctx.response.body.name, "New Product");
  assertEquals(ctx.response.body.price, 200);
});

Deno.test("ProductController: Update Product", async () => {
  const productService = new ProductService();
  const productController = new ProductController();

  const newProduct = {
    id: "1",
    name: "Test Product",
    price: 100,
    description: "This is a test product",
  };

  await productService.createProduct(newProduct);

  const ctx = {
    params: { id: "1" },
    request: {
      body: async () => ({
        value: {
          name: "Updated Product",
          price: 150,
          description: "This is an updated product",
        },
      }),
    },
    response: {
      body: null,
      status: null,
    },
  };

  await productController.updateProduct(ctx);
  assertEquals(ctx.response.status, 200);
  assertEquals(ctx.response.body.name, "Updated Product");
  assertEquals(ctx.response.body.price, 150);
});

Deno.test("ProductController: Delete Product", async () => {
  const productService = new ProductService();
  const productController = new ProductController();

  const newProduct = {
    id: "1",
    name: "Test Product",
    price: 100,
    description: "This is a test product",
  };

  await productService.createProduct(newProduct);

  const ctx = {
    params: { id: "1" },
    response: {
      body: null,
      status: null,
    },
  };

  await productController.deleteProduct(ctx);
  assertEquals(ctx.response.status, 204);
});
