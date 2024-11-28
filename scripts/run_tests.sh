#!/bin/bash

testFiles=(
  "./tests/frontend/HomePage_test.ts"
  "./tests/frontend/AboutPage_test.ts"
  "./tests/backend/userService_test.ts"
  "./tests/backend/productService_test.ts"
  "./tests/integration/e2e_test.ts"
)

for file in "${testFiles[@]}"; do
  deno test "$file"
done
