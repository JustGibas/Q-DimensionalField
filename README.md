# VoxelSpace

## Project Overview

<!-- P5719 -->
VoxelSpace is a VR/AR/XR game that uses voxel chunks to create a global server. Each voxel acts as a server, and users interact with voxel clones. Voxels communicate through events and only with neighboring voxels. The starting point is at coordinates (0, 0, 0), and each voxel extends 5 units in all directions, making it a 10-unit size voxel.

Vue.js is now integrated into the project for frontend development. 🖥️

## Project Structure

<!-- P5719 -->
The project has a clear directory structure with separate directories for Rust code, WebGPU setup, and Wasm modules:

- `src`: Contains the main Rust code for the voxel server and game logic.
- `web`: Contains the WebGPU setup and any frontend code.
- `wasm`: Contains the Wasm modules and related code.

## Setup Instructions

<!-- P5719 -->
1. Clone the repository:
   ```sh
   git clone https://github.com/JustGibas/VoxelSpace.git
   cd VoxelSpace
   ```

2. Install Rust and WebAssembly target:
   ```sh
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   rustup target add wasm32-unknown-unknown
   ```

3. Build the project:
   ```sh
   cargo build --release
   ```

4. Serve the project locally (e.g., using Vite):
   ```sh
   npm install -g vite
   vite
   ```

5. Install Deno:
   ```sh
   curl -fsSL https://deno.land/x/install/install.sh | sh
   ```

6. Run the project using Deno:
   ```sh
   deno run --allow-net --allow-read web/main.js
   ```

7. Install Vite:
   ```sh
   npm install -g vite
   ```

8. Run the project using Vite:
   ```sh
   vite
   ```

9. Deploy the project on Vercel:
   - Create a `vercel.json` file in the root directory with the following content:
     ```json
     {
       "builds": [
         { "src": "web/main.js", "use": "@vercel/node" }
       ],
       "routes": [
         { "src": "/(.*)", "dest": "web/main.js" }
       ]
     }
     ```
   - Install Vercel CLI:
     ```sh
     npm install -g vercel
     ```
   - Deploy the project:
     ```sh
     vercel
     ```

10. Install Vue.js:
    - Add a script tag to include Vue.js from a CDN in `web/index.html`:
      ```html
      <script src="https://cdn.jsdelivr.net/npm/vue@2"></script>
      ```

11. Initialize Vue.js app:
    - Create a `div` element with `id="app"` in `web/index.html`:
      ```html
      <div id="app"></div>
      ```

    - Initialize a Vue.js app in `web/main.js`:
      ```javascript
      new Vue({
        el: '#app',
        data: {
          message: 'Hello Vue!'
        }
      });
      ```

## Event-Driven Architecture and Microservices

<!-- P5719 -->
The project uses an event-driven architecture and microservices approach to ensure modularity and scalability. Each voxel acts as a server, handling its own state and communication with neighboring voxels. The communication is event-driven, allowing for real-time updates and interactions.

### Microservices with Wasm

<!-- P5719 -->
Microservices are implemented using Wasm modules in the `wasm` directory. Each microservice handles a specific aspect of the game, such as physics, AI, or user interactions. The event-driven architecture allows microservices to communicate with the main voxel server and other microservices by subscribing to relevant events and publishing events as needed.

## To-Do List

<!-- P5719 -->
- Add detailed comments and explanations to each function and class in the code to help students understand the purpose and functionality of the code. 📝
- Include comments explaining the parameters and return values of functions, as well as any important logic or algorithms used. 💡
- Add comments to explain the purpose of each file and how it fits into the overall project structure. 📂
- Expand the `README.md` file to include detailed information about the project, its structure, and how to set it up and run it. 📚
- Include a section on the technologies and libraries used in the project, with links to relevant documentation. 🔗
- Add a section on the project's architecture and design, explaining how the different components interact with each other. 🏗️
- Add `oak` to the `dependencies` section in `package.json` for handling HTTP requests and middleware in `controllers/userController.ts`, `main.ts`, `middlewares/authMiddleware.ts`, and `middlewares/errorMiddleware.ts`. 🌳
- Add `gl-matrix` to the `dependencies` section in `package.json` for matrix and vector operations in `web/main.js`. 📐
- Add `vite` to the `devDependencies` section in `package.json` for building and serving the project in `vite.config.ts`. 🚀
- Add `deno` to the `devDependencies` section in `package.json` for running and testing the project in `deno.json`. 🦕
- Improve the error handling in `controllers/productController.ts` and `controllers/userController.ts` to provide more informative error messages. ⚠️
- Add unit tests for the functions in `utils/helpers.ts` to ensure their correctness. 🧪
- Create a comprehensive guide on how to contribute to the project, including coding standards, branching strategy, and pull request guidelines. 🤝

## Docker and Kubernetes Setup

### Docker

<!-- P5719 -->
1. Create a `Dockerfile` in the root directory with the following content:
   ```Dockerfile
   # Use the official Rust image as the base image
   FROM rust:latest

   # Set the working directory
   WORKDIR /app

   # Copy the project files to the container
   COPY . .

   # Install WebAssembly target
   RUN rustup target add wasm32-unknown-unknown

   # Build the project
   RUN cargo build --release

   # Install Vite
   RUN npm install -g vite

   # Install Deno
   RUN curl -fsSL https://deno.land/x/install/install.sh | sh

   # Expose the port
   EXPOSE 3000

   # Start the project
   CMD ["vite"]
   ```

2. Build the Docker image:
   ```sh
   docker build -t voxelspace .
   ```

3. Run the Docker container:
   ```sh
   docker run -p 3000:3000 voxelspace
   ```

### Kubernetes

<!-- P5719 -->
1. Create a `deployment.yaml` file in the root directory with the following content:
   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: voxelspace-deployment
   spec:
     replicas: 3
     selector:
       matchLabels:
         app: voxelspace
     template:
       metadata:
         labels:
           app: voxelspace
       spec:
         containers:
         - name: voxelspace
           image: voxelspace:latest
           ports:
           - containerPort: 3000
   ```

2. Apply the deployment:
   ```sh
   kubectl apply -f deployment.yaml
   ```

3. Create a `service.yaml` file in the root directory with the following content:
   ```yaml
   apiVersion: v1
   kind: Service
   metadata:
     name: voxelspace-service
   spec:
     selector:
       app: voxelspace
     ports:
       - protocol: TCP
         port: 80
         targetPort: 3000
     type: LoadBalancer
   ```

4. Apply the service:
   ```sh
   kubectl apply -f service.yaml
   ```

## Serverless Functions with Vercel

<!-- P5719 -->
1. Create a `vercel.json` file in the root directory with the following content:
   ```json
   {
     "builds": [
       { "src": "web/main.js", "use": "@vercel/node" }
     ],
     "routes": [
       { "src": "/(.*)", "dest": "web/main.js" }
     ]
   }
   ```

2. Install Vercel CLI:
   ```sh
   npm install -g vercel
   ```

3. Deploy the project:
   ```sh
   vercel
   ```

## Prioritizing Serverless Functions

### Benefits of Serverless Functions

<!-- P5719 -->
- Scalability: Serverless functions automatically scale with the number of requests, ensuring that the application can handle high traffic without manual intervention.
- Cost-efficiency: With serverless functions, you only pay for the actual usage, reducing costs compared to traditional server-based architectures.
- Simplified deployment: Serverless functions can be deployed independently, allowing for faster and more frequent updates.

### Guidelines for Prioritizing Serverless Functions

<!-- P5719 -->
1. Identify functions that can benefit from serverless architecture, such as those with variable workloads or high scalability requirements.
2. Design functions to be stateless and idempotent, ensuring that they can be executed independently and repeatedly without side effects.
3. Use environment variables and configuration files to manage settings and secrets, avoiding hardcoding sensitive information in the code.
4. Implement proper error handling and logging to ensure that issues can be quickly identified and resolved.
5. Monitor the performance and usage of serverless functions to optimize their efficiency and cost-effectiveness.
