#!/bin/bash

# Function to deploy the frontend application
deployFrontend() {
  cd apps/frontend
  npm run deploy
  if [ $? -ne 0 ]; then
    echo "Error deploying frontend"
    exit 1
  fi
  cd -
}

# Function to deploy the backend application
deployBackend() {
  cd apps/backend
  deno task deploy
  if [ $? -ne 0 ]; then
    echo "Error deploying backend"
    exit 1
  fi
  cd -
}

# Function to deploy the shared UI library
deploySharedUI() {
  cd apps/shared-ui
  npm run deploy
  if [ $? -ne 0 ]; then
    echo "Error deploying shared UI"
    exit 1
  fi
  cd -
}

# Function to deploy the shared utilities
deploySharedUtils() {
  cd apps/shared-utils
  npm run deploy
  if [ $? -ne 0 ]; then
    echo "Error deploying shared utils"
    exit 1
  fi
  cd -
}

# Main function to deploy all apps/services
deployAll() {
  deployFrontend
  deployBackend
  deploySharedUI
  deploySharedUtils
  echo "All apps/services deployed successfully."
}

# Execute the deployAll function
deployAll
