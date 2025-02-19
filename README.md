# Q-DimensionalField

Q-DimensionalField is a VR game that uses voxel chunks to create a global server.

## Project Direction

* The project will be a VR game 🎮
* It will be hosted on GitHub Pages 🌐
* It will use Vercel APIs and Supabase for now 🔧
* The project will heavily use AI LLMs and generative AI for textures and 3D assets 🤖
* LLMs will act as guides within the game 🧭
* The main idea is that space will be divided into cubes, starting from the 000 point. The chunk `z0y0x0` is in the center and expands for example for 5 units in all axes, making a 10x10x10 cube. This is our base cube. We will have bigger parsecs that are for other logic. In the future, we will add more axes to our chunks, making it multidimensional. Entering in and out of a chunk could lead to a different place 🌌
* Document the project and prepare for GitHub Pages structure 📄
* This is a project in really early development, pre-MVP 🚀

## Directory Structure

The project is organized into the following directory structure:

```
root/
  ├── src/                      # Core frontend source code
  │   ├── components/           # Shared components for the host
  │   ├── pages/                # Routes/pages for the frontend
  │   └── index.html            # Base HTML
  ├── shared-ui/                # Shared UI components
  │   ├── src/                  # Source code for shared components
  ├── shared-utils/             # Shared utilities (types, helpers)
  │   ├── src/                  # Source code for shared utilities
  ├── platform-configs/         # Platform-specific configurations
  │   ├── web/                  # Configurations for web builds
  │   ├── desktop/              # Configurations for desktop builds
  │   ├── mobile/               # Configurations for mobile builds
  ├── tests/                    # Testing directory
  │   ├── frontend/             # Frontend tests
  │   ├── backend/              # Backend tests
  │   └── integration/          # End-to-end tests
  ├── scripts/                  # Automation scripts (build, deploy, etc.)
  │   ├── build_all.sh          # Script to build all apps/services
  │   ├── deploy_all.sh         # Script to deploy all apps/services
  │   └── run_tests.sh          # Script to run tests
  ├── infra/                    # Infrastructure-as-code files
  │   ├── terraform/            # Terraform configurations
  │   ├── nginx/                # NGINX or reverse proxy configurations
  │   └── certs/                # SSL certificates (if needed)
  ├── tsconfig.json             # TypeScript configuration for any TS files (optional)
  ├── .gitignore                # Ignore unnecessary files in Git
  └── README.md                 # Project documentation
```

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:
   ```sh
   git clone https://github.com/JustGibas/Q-DimensionalField.git
   cd Q-DimensionalField
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

5. To run the project locally using GitHub Pages, follow these steps:
   ```sh
   npm run build
   npm run deploy
   ```

## Building and Deploying

To build and deploy the project, follow these steps:

1. Build the project:
   ```sh
   npm run build
   ```

2. Deploy the project to GitHub Pages:
   ```sh
   npm run deploy
   ```

## Running Tests

To run the tests, follow these steps:

1. Run the tests:
   ```sh
   npm test
   ```

## Compiling to WebAssembly and JavaScript

To compile the project to WebAssembly and JavaScript, follow these steps:

1. Compile to WebAssembly:
   ```sh
   npm run build:wasm
   ```

2. Compile to JavaScript:
   ```sh
   npm run build:js
   ```

## Automated Maintenance Tasks

Regular maintenance tasks are automated to ensure code quality and consistency. These tasks include dependency updates, code formatting, and linting.

### Dependency Updates

We use GitHub Actions to automate dependency updates. The workflow is defined in `.github/workflows/maintenance.yml`.

### Code Formatting

We use Prettier for code formatting. To run Prettier, use the following command:
```sh
npm run fmt
```

### Linting

We use ESLint for linting. To run ESLint, use the following command:
```sh
npm run lint
```

## Contributing

If you would like to contribute to the project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and commit them.
4. Push your changes to your fork.
5. Create a pull request.

## Detailed Instructions for Contributors

### Setup

1. Ensure you have Node.js installed. If not, you can install it from [here](https://nodejs.org/).
2. Clone the repository:
   ```sh
   git clone https://github.com/JustGibas/Q-DimensionalField.git
   cd Q-DimensionalField
   ```
3. Install dependencies:
   ```sh
   npm install
   ```

### Build

To build the project, run:
```sh
npm run build
```

### Test

To run the tests, use:
```sh
npm test
```

### Run Locally

To run the project locally, use:
```sh
npm run dev
```

### Deploy

To deploy the project to GitHub Pages, use:
```sh
npm run deploy
```

## Using A-Frame and Three.js for Creating the Game

To create the game using A-Frame and Three.js, follow these steps:

1. Add A-Frame and Three.js libraries to your `index.html` file:
   ```html
   <script src="https://aframe.io/releases/1.2.0/aframe.min.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
   ```

2. Initialize A-Frame and Three.js in your main JavaScript file:
   ```js
   // Initialize A-Frame
   AFRAME.registerComponent('example', {
     init: function () {
       console.log('A-Frame component initialized');
     }
   });

   // Initialize Three.js
   const scene = new THREE.Scene();
   const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
   const renderer = new THREE.WebGLRenderer();
   renderer.setSize(window.innerWidth, window.innerHeight);
   document.body.appendChild(renderer.domElement);
   ```

## Loading Chunks with 8 or 16 Possible Variations

To load chunks with 8 or 16 possible variations, follow these steps:

1. Define the possible variations for the chunks:
   ```js
   const variations = [
     'variation1',
     'variation2',
     'variation3',
     'variation4',
     'variation5',
     'variation6',
     'variation7',
     'variation8',
     'variation9',
     'variation10',
     'variation11',
     'variation12',
     'variation13',
     'variation14',
     'variation15',
     'variation16'
   ];
   ```

2. Implement the logic to load a chunk with a random variation:
   ```js
   function loadChunk() {
     const randomIndex = Math.floor(Math.random() * variations.length);
     const selectedVariation = variations[randomIndex];
     console.log(`Loading chunk with variation: ${selectedVariation}`);
     // Add your logic to load the chunk with the selected variation
   }
   ```

## Using the Marching Cubes Algorithm

To use the marching cubes algorithm, follow these steps:

1. Add the marching cubes algorithm implementation to your project. You can use an existing library or implement it yourself.

2. Integrate the marching cubes algorithm with your Three.js scene:
   ```js
   // Example using Three.js marching cubes implementation
   const resolution = 28;
   const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
   const marchingCubes = new THREE.MarchingCubes(resolution, material);

   scene.add(marchingCubes);

   function updateMarchingCubes() {
     // Update the marching cubes field
     marchingCubes.reset();
     // Add your logic to update the field values
     marchingCubes.addBall(0.5, 0.5, 0.5, 0.1);
     renderer.render(scene, camera);
   }

   updateMarchingCubes();
   ```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## GitHub Actions Workflows

We use GitHub Actions for continuous integration and deployment. The workflows are defined in the `.github/workflows` directory.

### CI Workflow

The CI workflow is defined in `.github/workflows/ci.yml`. It runs on every push and pull request to the `main` branch. The workflow includes the following steps:

1. Checkout the code.
2. Set up Node.js.
3. Install dependencies.
4. Run linting.
5. Run tests.
6. Build the project.

### Deployment Workflow

The deployment workflow is defined in `.github/workflows/deploy.yml`. It runs on every push to the `main` branch. The workflow includes the following steps:

1. Checkout the code.
2. Set up Node.js.
3. Install dependencies.
4. Build the project.
5. Deploy to GitHub Pages.
