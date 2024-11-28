import { exec } from "child_process";

// Function to build the frontend application
function buildFrontend() {
  return new Promise((resolve, reject) => {
    exec("cd apps/frontend && deno task build", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error building frontend: ${error.message}`);
        reject(error);
      } else {
        console.log(`Frontend build output: ${stdout}`);
        resolve(stdout);
      }
    });
  });
}

// Function to build the backend application
function buildBackend() {
  return new Promise((resolve, reject) => {
    exec("cd apps/backend && deno task build", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error building backend: ${error.message}`);
        reject(error);
      } else {
        console.log(`Backend build output: ${stdout}`);
        resolve(stdout);
      }
    });
  });
}

// Function to build the shared UI library
function buildSharedUI() {
  return new Promise((resolve, reject) => {
    exec("cd apps/shared-ui && deno task build", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error building shared UI: ${error.message}`);
        reject(error);
      } else {
        console.log(`Shared UI build output: ${stdout}`);
        resolve(stdout);
      }
    });
  });
}

// Function to build the shared utilities
function buildSharedUtils() {
  return new Promise((resolve, reject) => {
    exec("cd apps/shared-utils && deno task build", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error building shared utils: ${error.message}`);
        reject(error);
      } else {
        console.log(`Shared utils build output: ${stdout}`);
        resolve(stdout);
      }
    });
  });
}

// Main function to build all apps/services
async function buildAll() {
  try {
    await buildFrontend();
    await buildBackend();
    await buildSharedUI();
    await buildSharedUtils();
    console.log("All apps/services built successfully.");
  } catch (error) {
    console.error("Error building apps/services:", error);
  }
}

// Execute the buildAll function
buildAll();
