/**
 * This file contains the ProductController class, which handles the HTTP requests related to products.
 * It interacts with the ProductService to perform CRUD operations on products.
 */

import { ProductService } from "../services/productService.ts";

// The ProductController class handles the HTTP requests related to products
export class ProductController {
  private productService: ProductService;

  /**
   * Constructor for the ProductController class
   * Initializes the ProductService instance
   */
  constructor() {
    this.productService = new ProductService();
  }

  /**
   * Get all products
   * @param ctx - The context object containing request and response
   */
  async getAllProducts(ctx: any) {
    try {
      const products = await this.productService.getAllProducts();
      ctx.response.body = products;
    } catch (error) {
      // Handle error
      ctx.response.status = 500;
      ctx.response.body = { message: "Failed to fetch products", error: error.message };
    }
  }

  /**
   * Get a product by ID
   * @param ctx - The context object containing request and response
   */
  async getProductById(ctx: any) {
    try {
      const id = ctx.params.id;
      const product = await this.productService.getProductById(id);
      if (product) {
        ctx.response.body = product;
      } else {
        ctx.response.status = 404;
        ctx.response.body = { message: "Product not found" };
      }
    } catch (error) {
      // Handle error
      ctx.response.status = 500;
      ctx.response.body = { message: "Failed to fetch product", error: error.message };
    }
  }

  /**
   * Create a new product
   * @param ctx - The context object containing request and response
   */
  async createProduct(ctx: any) {
    try {
      const { name, price, description } = await ctx.request.body().value;
      const newProduct = await this.productService.createProduct({ name, price, description });
      ctx.response.status = 201;
      ctx.response.body = newProduct;
    } catch (error) {
      // Handle error
      ctx.response.status = 500;
      ctx.response.body = { message: "Failed to create product", error: error.message };
    }
  }

  /**
   * Update an existing product
   * @param ctx - The context object containing request and response
   */
  async updateProduct(ctx: any) {
    try {
      const id = ctx.params.id;
      const { name, price, description } = await ctx.request.body().value;
      const updatedProduct = await this.productService.updateProduct(id, { name, price, description });
      if (updatedProduct) {
        ctx.response.body = updatedProduct;
      } else {
        ctx.response.status = 404;
        ctx.response.body = { message: "Product not found" };
      }
    } catch (error) {
      // Handle error
      ctx.response.status = 500;
      ctx.response.body = { message: "Failed to update product", error: error.message };
    }
  }

  /**
   * Delete a product by ID
   * @param ctx - The context object containing request and response
   */
  async deleteProduct(ctx: any) {
    try {
      const id = ctx.params.id;
      const deleted = await this.productService.deleteProduct(id);
      if (deleted) {
        ctx.response.status = 204;
      } else {
        ctx.response.status = 404;
        ctx.response.body = { message: "Product not found" };
      }
    } catch (error) {
      // Handle error
      ctx.response.status = 500;
      ctx.response.body = { message: "Failed to delete product", error: error.message };
    }
  }
}
