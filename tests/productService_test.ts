import { assertEquals, assertNotEquals } from "https://deno.land/std/testing/asserts.ts";
import { ProductService } from "../services/productService.ts";
import { Product } from "../models/productModel.ts";

Deno.test("ProductService: getAllProducts", async () => {
  const productService = new ProductService();
  const products = await productService.getAllProducts();
  assertEquals(products.length, 0);
});

Deno.test("ProductService: createProduct", async () => {
  const productService = new ProductService();
  const newProduct: Product = { id: "1", name: "Test Product", price: 100, description: "Test Description" };
  const createdProduct = await productService.createProduct(newProduct);
  assertEquals(createdProduct, newProduct);
});

Deno.test("ProductService: getProductById", async () => {
  const productService = new ProductService();
  const newProduct: Product = { id: "1", name: "Test Product", price: 100, description: "Test Description" };
  await productService.createProduct(newProduct);
  const product = await productService.getProductById("1");
  assertEquals(product, newProduct);
});

Deno.test("ProductService: updateProduct", async () => {
  const productService = new ProductService();
  const newProduct: Product = { id: "1", name: "Test Product", price: 100, description: "Test Description" };
  await productService.createProduct(newProduct);
  const updatedProduct: Product = { id: "1", name: "Updated Product", price: 150, description: "Updated Description" };
  const result = await productService.updateProduct("1", updatedProduct);
  assertEquals(result, updatedProduct);
});

Deno.test("ProductService: deleteProduct", async () => {
  const productService = new ProductService();
  const newProduct: Product = { id: "1", name: "Test Product", price: 100, description: "Test Description" };
  await productService.createProduct(newProduct);
  const result = await productService.deleteProduct("1");
  assertEquals(result, true);
  const product = await productService.getProductById("1");
  assertEquals(product, undefined);
});
