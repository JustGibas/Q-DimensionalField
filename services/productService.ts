import { Product } from "../models/productModel.ts";

export class ProductService {
  private products: Product[] = [];

  async getAllProducts(): Promise<Product[]> {
    return this.products;
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return this.products.find(product => product.id === id);
  }

  async createProduct(product: Product): Promise<Product> {
    this.products.push(product);
    return product;
  }

  async updateProduct(id: string, updatedProduct: Product): Promise<Product | undefined> {
    const index = this.products.findIndex(product => product.id === id);
    if (index !== -1) {
      this.products[index] = updatedProduct;
      return updatedProduct;
    }
    return undefined;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const index = this.products.findIndex(product => product.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      return true;
    }
    return false;
  }
}
