import { runTests } from "https://deno.land/std@0.205.0/testing/mod.ts";

async function runAllTests() {
  const testFiles = [
    "./tests/frontend/HomePage_test.ts",
    "./tests/frontend/AboutPage_test.ts",
    "./tests/backend/userService_test.ts",
    "./tests/backend/productService_test.ts",
    "./tests/integration/e2e_test.ts",
  ];

  for (const file of testFiles) {
    await import(file);
  }

  runTests();
}

runAllTests();
