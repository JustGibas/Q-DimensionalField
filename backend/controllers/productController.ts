/**
 * This file contains the ProductController class, which handles the HTTP requests related to products.
 * It interacts with the ProductService to perform CRUD operations on products.
 * 
 * Configuration options:
 * - ctx: The context object containing request and response.
 * - id: The ID of the product.
 * - name: The name of the product.
 * - price: The price of the product.
 * - description: The description of the product.
 */

import { ProductService } from "../services/productService.ts";
import { BaseController } from "./baseController.ts";

// The ProductController class handles the HTTP requests related to products
export class ProductController extends BaseController {
  private productService: ProductService;

  /**
   * Constructor for the ProductController class
   * Initializes the ProductService instance
   */
  constructor() {
    super();
    this.productService = new ProductService();
  }

  /**
   * Get all products
   * @param ctx - The context object containing request and response
   */
  async getAllProducts(ctx: any) {
    try {
      const products = await this.productService.getAllProducts();
      this.sendJsonResponse(ctx, 200, products);
    } catch (error) {
      this.handleError(ctx, error);
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
        this.sendJsonResponse(ctx, 200, product);
      } else {
        this.sendJsonResponse(ctx, 404, { message: "Product not found" });
      }
    } catch (error) {
      this.handleError(ctx, error);
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
      this.sendJsonResponse(ctx, 201, newProduct);
    } catch (error) {
      this.handleError(ctx, error);
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
        this.sendJsonResponse(ctx, 200, updatedProduct);
      } else {
        this.sendJsonResponse(ctx, 404, { message: "Product not found" });
      }
    } catch (error) {
      this.handleError(ctx, error);
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
        this.sendJsonResponse(ctx, 404, { message: "Product not found" });
      }
    } catch (error) {
      this.handleError(ctx, error);
    }
  }
}
