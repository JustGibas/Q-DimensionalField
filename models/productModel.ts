/**
 * The Product interface represents a product in the system.
 * It contains properties that describe the product.
 */
export interface Product {
  /**
   * The unique identifier of the product.
   */
  id: string;

  /**
   * The name of the product.
   */
  name: string;

  /**
   * The price of the product.
   */
  price: number;

  /**
   * The description of the product.
   */
  description: string;
}
