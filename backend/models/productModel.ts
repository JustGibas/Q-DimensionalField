/**
 * This file contains the Product interface, which represents a product in the system.
 * It defines the properties that describe a product, including its unique identifier, name, price, and description.
 * 
 * Configuration options:
 * - id: The unique identifier of the product.
 * - name: The name of the product.
 * - price: The price of the product.
 * - description: The description of the product.
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
