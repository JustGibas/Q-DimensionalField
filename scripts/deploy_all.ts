import { exec } from "child_process";

// Function to deploy the frontend application
function deployFrontend() {
  return new Promise((resolve, reject) => {
    exec("cd apps/frontend && npm run deploy", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error deploying frontend: ${error.message}`);
        reject(error);
      } else {
        console.log(`Frontend deploy output: ${stdout}`);
        resolve(stdout);
      }
    });
  });
}

// Function to deploy the backend application
function deployBackend() {
  return new Promise((resolve, reject) => {
    exec("cd apps/backend && deno task deploy", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error deploying backend: ${error.message}`);
        reject(error);
      } else {
        console.log(`Backend deploy output: ${stdout}`);
        resolve(stdout);
      }
    });
  });
}

// Function to deploy the shared UI library
function deploySharedUI() {
  return new Promise((resolve, reject) => {
    exec("cd apps/shared-ui && npm run deploy", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error deploying shared UI: ${error.message}`);
        reject(error);
      } else {
        console.log(`Shared UI deploy output: ${stdout}`);
        resolve(stdout);
      }
    });
  });
}

// Function to deploy the shared utilities
function deploySharedUtils() {
  return new Promise((resolve, reject) => {
    exec("cd apps/shared-utils && npm run deploy", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error deploying shared utils: ${error.message}`);
        reject(error);
      } else {
        console.log(`Shared utils deploy output: ${stdout}`);
        resolve(stdout);
      }
    });
  });
}

// Main function to deploy all apps/services
async function deployAll() {
  try {
    await deployFrontend();
    await deployBackend();
    await deploySharedUI();
    await deploySharedUtils();
    console.log("All apps/services deployed successfully.");
  } catch (error) {
    console.error("Error deploying apps/services:", error);
  }
}

// Execute the deployAll function
deployAll();
