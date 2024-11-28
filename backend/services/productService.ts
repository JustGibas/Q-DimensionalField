/**
 * This file contains the ProductService class, which handles the business logic related to products.
 * It interacts with the ProductModel to perform CRUD operations on products.
 * 
 * Configuration options:
 * - id: The ID of the product.
 * - name: The name of the product.
 * - price: The price of the product.
 * - description: The description of the product.
 */

import { Product } from "../models/productModel.ts";
import { Client } from "https://deno.land/x/postgres/mod.ts";

// PostgreSQL client configuration
const client = new Client({
  user: "your_user",
  database: "your_database",
  hostname: "localhost",
  password: "your_password",
  port: 5432,
});

// Connect to the database
await client.connect();

// The ProductService class handles the business logic related to products
export class ProductService {
  /**
   * Get all products
   * @returns An array of all products
   */
  async getAllProducts(): Promise<Product[]> {
    const result = await client.queryObject<Product>("SELECT * FROM products");
    return result.rows;
  }

  /**
   * Get a product by ID
   * @param id - The ID of the product
   * @returns The product with the specified ID, or null if not found
   */
  async getProductById(id: string): Promise<Product | null> {
    const result = await client.queryObject<Product>(
      "SELECT * FROM products WHERE id = $1",
      id,
    );
    return result.rows.length ? result.rows[0] : null;
  }

  /**
   * Create a new product
   * @param product - The product to create
   * @returns The created product
   */
  async createProduct(product: Product): Promise<Product> {
    await client.queryObject(
      "INSERT INTO products (id, name, price, description) VALUES ($1, $2, $3, $4)",
      product.id,
      product.name,
      product.price,
      product.description,
    );
    return product;
  }

  /**
   * Update an existing product
   * @param id - The ID of the product to update
   * @param updatedProduct - The updated product data
   * @returns The updated product, or null if not found
   */
  async updateProduct(id: string, updatedProduct: Product): Promise<Product | null> {
    const result = await client.queryObject(
      "UPDATE products SET name = $1, price = $2, description = $3 WHERE id = $4 RETURNING *",
      updatedProduct.name,
      updatedProduct.price,
      updatedProduct.description,
      id,
    );
    return result.rows.length ? result.rows[0] : null;
  }

  /**
   * Delete a product by ID
   * @param id - The ID of the product to delete
   * @returns A boolean indicating whether the product was deleted
   */
  async deleteProduct(id: string): Promise<boolean> {
    const result = await client.queryObject<Product>(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      id,
    );
    return result.rows.length ? true : false;
  }
}
