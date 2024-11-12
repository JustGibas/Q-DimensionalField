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
