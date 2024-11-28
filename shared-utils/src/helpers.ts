/**
 * This file contains shared utility functions that can be used across different parts of the application.
 * It includes functions for common tasks such as formatting dates, generating unique IDs, and more.
 * 
 * Configuration options:
 * - date: The date to be formatted.
 * - format: The format string for the date.
 * - length: The length of the unique ID to be generated.
 * - characters: The characters to be used for generating the unique ID.
 */

/**
 * Formats a date according to the specified format string.
 * @param date - The date to be formatted.
 * @param format - The format string for the date.
 * @returns The formatted date string.
 */
export function formatDate(date: Date, format: string): string {
  const options: Intl.DateTimeFormatOptions = {};

  if (format.includes("yyyy")) options.year = "numeric";
  if (format.includes("MM")) options.month = "2-digit";
  if (format.includes("dd")) options.day = "2-digit";
  if (format.includes("HH")) options.hour = "2-digit";
  if (format.includes("mm")) options.minute = "2-digit";
  if (format.includes("ss")) options.second = "2-digit";

  return new Intl.DateTimeFormat("en-US", options).format(date);
}

/**
 * Generates a unique ID of the specified length using the provided characters.
 * @param length - The length of the unique ID to be generated.
 * @param characters - The characters to be used for generating the unique ID.
 * @returns The generated unique ID.
 */
export function generateUniqueId(length: number, characters: string): string {
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
