/**
 * This file contains the User interface, which represents a user in the system.
 * It defines the properties that describe a user, including their unique identifier, name, email, and password.
 * 
 * Configuration options:
 * - id: The unique identifier of the user.
 * - name: The name of the user.
 * - email: The email address of the user.
 * - password: The password of the user.
 */

export interface User {
  /**
   * The unique identifier of the user.
   */
  id: string;

  /**
   * The name of the user.
   */
  name: string;

  /**
   * The email address of the user.
   */
  email: string;

  /**
   * The password of the user.
   */
  password: string;
}
