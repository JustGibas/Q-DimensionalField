# VoxelSpace

## Project Overview

VoxelSpace is a VR/AR/XR game that uses voxel chunks to create a global server. Each voxel acts as a server, and users interact with voxel clones. Voxels communicate through events and only with neighboring voxels. The starting point is at coordinates (0, 0, 0), and each voxel extends 5 units in all directions, making it a 10-unit size voxel.

## Project Structure

The project has a clear directory structure with separate directories for Rust code, WebGPU setup, and Wasm modules:

- `src`: Contains the main Rust code for the voxel server and game logic.
- `web`: Contains the WebGPU setup and any frontend code.
- `wasm`: Contains the Wasm modules and related code.

## Setup Instructions

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

## Event-Driven Architecture and Microservices

The project uses an event-driven architecture and microservices approach to ensure modularity and scalability. Each voxel acts as a server, handling its own state and communication with neighboring voxels. The communication is event-driven, allowing for real-time updates and interactions.

### Microservices with Wasm

Microservices are implemented using Wasm modules in the `wasm` directory. Each microservice handles a specific aspect of the game, such as physics, AI, or user interactions. The event-driven architecture allows microservices to communicate with the main voxel server and other microservices by subscribing to relevant events and publishing events as needed.
