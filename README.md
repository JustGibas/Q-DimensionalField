# VoxelSpace

VoxelSpace is a VR/AR/XR game that uses voxel chunks to create a global server.

## Directory Structure

The project is organized into the following directory structure:

```
root/
  ├── apps/                         # Independent applications (frontend, backend, micro-frontends)
  │   ├── frontend/                 # Main frontend application (micro-frontend host)
  │   │   ├── static/               # Static assets (HTML, CSS, images)
  │   │   ├── src/                  # Core frontend source code
  │   │   │   ├── bootstrap.rs      # App initialization for micro-frontend integration
  │   │   │   ├── components/       # Shared components for the host
  │   │   │   ├── pages/            # Routes/pages for the frontend
  │   │   │   └── index.html        # Base HTML
  │   │   ├── micro-frontends/      # Micro-frontend integrations
  │   │   │   ├── dashboard/        # Example micro-frontend (Rust/WebAssembly)
  │   │   │   ├── profile/          # Another micro-frontend
  │   │   │   └── settings/         # Another micro-frontend
  │   │   ├── Cargo.toml            # Rust configuration for the frontend
  │   │   └── Dockerfile            # Dockerfile for frontend service
  │   ├── backend/                  # Backend application (API, services)
  │   │   ├── controllers/          # API route handlers
  │   │   ├── services/             # Business logic and services
  │   │   ├── models/               # Database models or schemas
  │   │   ├── middlewares/          # Backend middlewares
  │   │   ├── routes/               # Main router
  │   │   ├── main.rs               # Backend entry point
  │   │   ├── Cargo.toml            # Rust configuration for the backend
  │   │   └── Dockerfile            # Dockerfile for backend service
  │   ├── shared-ui/                # Shared UI components (used across micro-frontends)
  │   │   ├── src/                  # Source code for shared components
  │   │   ├── lib.rs                # Entry point for shared UI library
  │   │   ├── Cargo.toml            # Rust configuration for shared library
  │   │   └── Dockerfile            # Optional Dockerfile for deployment
  │   └── shared-utils/             # Shared utilities (types, helpers)
  │       ├── src/                  # Source code for shared utilities
  │       ├── lib.rs                # Entry point for shared utilities
  │       ├── Cargo.toml            # Rust configuration for utilities
  │       └── Dockerfile            # Optional Dockerfile for deployment
  ├── platform-configs/             # Platform-specific configurations
  │   ├── docker-compose.yaml       # Docker Compose setup for all services
  │   ├── web/                      # Configurations for web builds
  │   ├── desktop/                  # Configurations for desktop builds
  │   ├── mobile/                   # Configurations for mobile builds
  │   └── deno.json                 # Deno configuration file
  ├── tests/                        # Testing directory
  │   ├── frontend/                 # Frontend tests
  │   ├── backend/                  # Backend tests
  │   └── integration/              # End-to-end tests
  ├── scripts/                      # Automation scripts (build, deploy, etc.)
  │   ├── build_all.sh              # Script to build all apps/services
  │   ├── deploy_all.sh             # Script to deploy all apps/services
  │   └── run_tests.sh              # Script to run tests
  ├── infra/                        # Infrastructure-as-code files
  │   ├── k8s/                      # Kubernetes deployment files
  │   ├── terraform/                # Terraform configurations
  │   ├── nginx/                    # NGINX or reverse proxy configurations
  │   └── certs/                    # SSL certificates (if needed)
  ├── Cargo.toml                    # Rust workspace configuration
  ├── tsconfig.json                 # TypeScript configuration for any TS files (optional)
  ├── .dockerignore                 # Ignore unnecessary files during Docker build
  ├── .gitignore                    # Ignore unnecessary files in Git
  └── README.md                     # Project documentation
```

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:
   ```sh
   git clone https://github.com/JustGibas/VoxelSpace.git
   cd VoxelSpace
   ```

2. Install dependencies:
   ```sh
   deno task install
   ```

3. Start the development server:
   ```sh
   deno task dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## Building and Deploying

To build and deploy the project, follow these steps:

1. Build the project:
   ```sh
   deno task build
   ```

2. Deploy the project:
   ```sh
   deno task deploy
   ```

## Running Tests

To run the tests, follow these steps:

1. Run the tests:
   ```sh
   deno task test
   ```

## Compiling to WebAssembly and JavaScript

To compile the project to WebAssembly and JavaScript, follow these steps:

1. Compile to WebAssembly:
   ```sh
   deno task build:wasm
   ```

2. Compile to JavaScript:
   ```sh
   deno task build:js
   ```

## Contributing

If you would like to contribute to the project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and commit them.
4. Push your changes to your fork.
5. Create a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
