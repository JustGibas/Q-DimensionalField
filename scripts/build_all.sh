#!/bin/bash

# Function to build the frontend application
buildFrontend() {
  cd apps/frontend && npm run build
  if [ $? -ne 0 ]; then
    echo "Error building frontend"
    exit 1
  fi
  cd - > /dev/null
}

# Function to build the backend application
buildBackend() {
  cd apps/backend && deno task build
  if [ $? -ne 0 ]; then
    echo "Error building backend"
    exit 1
  fi
  cd - > /dev/null
}

# Function to build the shared UI library
buildSharedUI() {
  cd apps/shared-ui && npm run build
  if [ $? -ne 0 ]; then
    echo "Error building shared UI"
    exit 1
  fi
  cd - > /dev/null
}

# Function to build the shared utilities
buildSharedUtils() {
  cd apps/shared-utils && npm run build
  if [ $? -ne 0 ]; then
    echo "Error building shared utils"
    exit 1
  fi
  cd - > /dev/null
}

# Main function to build all apps/services
buildAll() {
  buildFrontend
  buildBackend
  buildSharedUI
  buildSharedUtils
  echo "All apps/services built successfully."
}

# Execute the buildAll function
buildAll
