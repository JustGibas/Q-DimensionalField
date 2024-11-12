/**
 * This file contains helper functions that are used throughout the application.
 * These functions perform common tasks such as string manipulation, ID generation, date formatting, and email validation.
 * Each function is explained in detail to help students understand its purpose and parameters.
 */

/**
 * Capitalizes the first letter of a string.
 * @param {string} string - The string to capitalize.
 * @returns {string} - The string with the first letter capitalized.
 */
export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Generates a random ID.
 * @returns {string} - A random ID.
 */
export function generateRandomId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Formats a date to a readable string.
 * @param {Date} date - The date to format.
 * @returns {string} - The formatted date string.
 */
export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString(undefined, options);
}

/**
 * Validates an email address.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - True if the email address is valid, false otherwise.
 */
export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
