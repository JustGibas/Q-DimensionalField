import { assertEquals, assertNotEquals } from "https://deno.land/std@0.205.0/testing/asserts.ts";
import { ProductService } from "../../apps/backend/services/productService.ts";
import { Product } from "../../apps/backend/models/productModel.ts";

Deno.test("ProductService: Create and Get Product", async () => {
  const productService = new ProductService();
  const newProduct: Product = {
    id: "1",
    name: "Test Product",
    price: 100,
    description: "This is a test product",
  };

  const createdProduct = await productService.createProduct(newProduct);
  assertEquals(createdProduct, newProduct);

  const fetchedProduct = await productService.getProductById("1");
  assertEquals(fetchedProduct, newProduct);
});

Deno.test("ProductService: Update Product", async () => {
  const productService = new ProductService();
  const newProduct: Product = {
    id: "1",
    name: "Test Product",
    price: 100,
    description: "This is a test product",
  };

  await productService.createProduct(newProduct);

  const updatedProduct: Product = {
    id: "1",
    name: "Updated Product",
    price: 150,
    description: "This is an updated test product",
  };

  const result = await productService.updateProduct("1", updatedProduct);
  assertEquals(result, updatedProduct);

  const fetchedProduct = await productService.getProductById("1");
  assertEquals(fetchedProduct, updatedProduct);
});

Deno.test("ProductService: Delete Product", async () => {
  const productService = new ProductService();
  const newProduct: Product = {
    id: "1",
    name: "Test Product",
    price: 100,
    description: "This is a test product",
  };

  await productService.createProduct(newProduct);

  const deleteResult = await productService.deleteProduct("1");
  assertEquals(deleteResult, true);

  const fetchedProduct = await productService.getProductById("1");
  assertEquals(fetchedProduct, null);
});
