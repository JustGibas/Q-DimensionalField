import { assertEquals, assertNotEquals } from "https://deno.land/std/testing/asserts.ts";
import { capitalizeFirstLetter, generateRandomId, formatDate, isValidEmail } from "../utils/helpers.ts";

// Test case for capitalizeFirstLetter function
Deno.test("capitalizeFirstLetter - should capitalize the first letter of a string", () => {
  const result = capitalizeFirstLetter("hello");
  assertEquals(result, "Hello");
});

// Test case for generateRandomId function
Deno.test("generateRandomId - should generate a random ID", () => {
  const id1 = generateRandomId();
  const id2 = generateRandomId();
  assertNotEquals(id1, id2);
});

// Test case for formatDate function
Deno.test("formatDate - should format a date to a readable string", () => {
  const date = new Date("2022-01-01");
  const result = formatDate(date);
  assertEquals(result, "January 1, 2022");
});

// Test case for isValidEmail function
Deno.test("isValidEmail - should validate an email address", () => {
  const validEmail = "test@example.com";
  const invalidEmail = "invalid-email";
  assertEquals(isValidEmail(validEmail), true);
  assertEquals(isValidEmail(invalidEmail), false);
});
