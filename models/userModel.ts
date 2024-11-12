/**
 * The User interface represents a user in the system.
 * It contains properties that describe the user.
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
