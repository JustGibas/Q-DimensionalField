import * as THREE from 'three';
import 'aframe';

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

// Define the possible variations for the chunks
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

// Implement the logic to load a chunk with a random variation
function loadChunk() {
  const randomIndex = Math.floor(Math.random() * variations.length);
  const selectedVariation = variations[randomIndex];
  console.log(`Loading chunk with variation: ${selectedVariation}`);
  // Add your logic to load the chunk with the selected variation
}

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
