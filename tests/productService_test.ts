/**
 * This file contains the test cases for the ProductService class.
 * It tests the functionality of CRUD operations on products, including getting all products, creating a new product, getting a product by ID, updating an existing product, and deleting a product.
 * 
 * Configuration options:
 * - assertEquals: Asserts that two values are equal.
 * - assertNotEquals: Asserts that two values are not equal.
 * - ProductService: The service class for handling product-related operations.
 * - Product: The interface representing a product.
 */

import { assertEquals, assertNotEquals } from "https://deno.land/std/testing/asserts.ts";
import { ProductService } from "../services/productService.ts";
import { Product } from "../models/productModel.ts";

// Test case for getting all products
Deno.test("ProductService: getAllProducts", async () => {
  const productService = new ProductService();
  const products = await productService.getAllProducts();
  // Assert that the initial products array is empty
  assertEquals(products.length, 0);
});

// Test case for creating a new product
Deno.test("ProductService: createProduct", async () => {
  const productService = new ProductService();
  const newProduct: Product = { id: "1", name: "Test Product", price: 100, description: "Test Description" };
  const createdProduct = await productService.createProduct(newProduct);
  // Assert that the created product matches the new product
  assertEquals(createdProduct, newProduct);
});

// Test case for getting a product by ID
Deno.test("ProductService: getProductById", async () => {
  const productService = new ProductService();
  const newProduct: Product = { id: "1", name: "Test Product", price: 100, description: "Test Description" };
  await productService.createProduct(newProduct);
  const product = await productService.getProductById("1");
  // Assert that the fetched product matches the new product
  assertEquals(product, newProduct);
});

// Test case for updating an existing product
Deno.test("ProductService: updateProduct", async () => {
  const productService = new ProductService();
  const newProduct: Product = { id: "1", name: "Test Product", price: 100, description: "Test Description" };
  await productService.createProduct(newProduct);
  const updatedProduct: Product = { id: "1", name: "Updated Product", price: 150, description: "Updated Description" };
  const result = await productService.updateProduct("1", updatedProduct);
  // Assert that the updated product matches the updated product data
  assertEquals(result, updatedProduct);
});

// Test case for deleting a product by ID
Deno.test("ProductService: deleteProduct", async () => {
  const productService = new ProductService();
  const newProduct: Product = { id: "1", name: "Test Product", price: 100, description: "Test Description" };
  await productService.createProduct(newProduct);
  const result = await productService.deleteProduct("1");
  // Assert that the product was successfully deleted
  assertEquals(result, true);
  const product = await productService.getProductById("1");
  // Assert that the fetched product is undefined after deletion
  assertEquals(product, undefined);
});
