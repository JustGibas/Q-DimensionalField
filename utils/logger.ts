/**
 * This file contains logging functions that are used throughout the application.
 * These functions log informational, warning, and error messages to the console.
 * Each function is explained in detail to help students understand its purpose and parameters.
 * 
 * Configuration options:
 * - message: The message to log.
 */

/**
 * Logs an informational message to the console.
 * @param {string} message - The message to log.
 */
export function logInfo(message: string) {
  console.log(`INFO: ${message}`);
}

/**
 * Logs a warning message to the console.
 * @param {string} message - The message to log.
 */
export function logWarning(message: string) {
  console.warn(`WARNING: ${message}`);
}

/**
 * Logs an error message to the console.
 * @param {string} message - The message to log.
 */
export function logError(message: string) {
  console.error(`ERROR: ${message}`);
}
