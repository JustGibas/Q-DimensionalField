/**
 * This file contains the ProductService class, which handles the business logic related to products.
 * It provides methods for CRUD operations on products, including getting all products, getting a product by ID, creating a new product, updating an existing product, and deleting a product.
 * 
 * Configuration options:
 * - products: An array to store the products.
 * - id: The unique identifier of the product.
 * - name: The name of the product.
 * - price: The price of the product.
 * - description: The description of the product.
 */

import { Product } from "../models/productModel.ts";

// The ProductService class handles the business logic related to products
export class ProductService {
  private products: Product[] = [];

  /**
   * Get all products
   * @returns {Promise<Product[]>} - A promise that resolves to an array of products
   */
  async getAllProducts(): Promise<Product[]> {
    return this.products;
  }

  /**
   * Get a product by ID
   * @param {string} id - The ID of the product
   * @returns {Promise<Product | undefined>} - A promise that resolves to the product or undefined if not found
   */
  async getProductById(id: string): Promise<Product | undefined> {
    return this.products.find(product => product.id === id);
  }

  /**
   * Create a new product
   * @param {Product} product - The product to create
   * @returns {Promise<Product>} - A promise that resolves to the created product
   */
  async createProduct(product: Product): Promise<Product> {
    this.products.push(product);
    return product;
  }

  /**
   * Update an existing product
   * @param {string} id - The ID of the product to update
   * @param {Product} updatedProduct - The updated product data
   * @returns {Promise<Product | undefined>} - A promise that resolves to the updated product or undefined if not found
   */
  async updateProduct(id: string, updatedProduct: Product): Promise<Product | undefined> {
    const index = this.products.findIndex(product => product.id === id);
    if (index !== -1) {
      this.products[index] = updatedProduct;
      return updatedProduct;
    }
    return undefined;
  }

  /**
   * Delete a product by ID
   * @param {string} id - The ID of the product to delete
   * @returns {Promise<boolean>} - A promise that resolves to true if the product was deleted, false otherwise
   */
  async deleteProduct(id: string): Promise<boolean> {
    const index = this.products.findIndex(product => product.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      return true;
    }
    return false;
  }
}
