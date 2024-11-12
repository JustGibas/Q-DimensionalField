import { ProductService } from "../services/productService.ts";

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  async getAllProducts(ctx: any) {
    try {
      const products = await this.productService.getAllProducts();
      ctx.response.body = products;
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = { message: "Failed to fetch products" };
    }
  }

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
      ctx.response.status = 500;
      ctx.response.body = { message: "Failed to fetch product" };
    }
  }

  async createProduct(ctx: any) {
    try {
      const { name, price, description } = await ctx.request.body().value;
      const newProduct = await this.productService.createProduct({ name, price, description });
      ctx.response.status = 201;
      ctx.response.body = newProduct;
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = { message: "Failed to create product" };
    }
  }

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
      ctx.response.status = 500;
      ctx.response.body = { message: "Failed to update product" };
    }
  }

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
      ctx.response.status = 500;
      ctx.response.body = { message: "Failed to delete product" };
    }
  }
}
