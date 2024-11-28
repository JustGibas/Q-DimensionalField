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

// The ProductService class handles the business logic related to products
export class ProductService {
  private products: Map<string, Product> = new Map();

  /**
   * Get all products
   * @returns An array of all products
   */
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  /**
   * Get a product by ID
   * @param id - The ID of the product
   * @returns The product with the specified ID, or null if not found
   */
  async getProductById(id: string): Promise<Product | null> {
    return this.products.get(id) || null;
  }

  /**
   * Create a new product
   * @param product - The product to create
   * @returns The created product
   */
  async createProduct(product: Product): Promise<Product> {
    this.products.set(product.id, product);
    return product;
  }

  /**
   * Update an existing product
   * @param id - The ID of the product to update
   * @param updatedProduct - The updated product data
   * @returns The updated product, or null if not found
   */
  async updateProduct(id: string, updatedProduct: Product): Promise<Product | null> {
    if (this.products.has(id)) {
      this.products.set(id, updatedProduct);
      return updatedProduct;
    }
    return null;
  }

  /**
   * Delete a product by ID
   * @param id - The ID of the product to delete
   * @returns A boolean indicating whether the product was deleted
   */
  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }
}
