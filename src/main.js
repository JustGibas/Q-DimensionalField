import 'aframe';
import 'taichi.js';

// Initialize A-Frame
AFRAME.registerComponent('example', {
  init: function () {
    console.log('A-Frame component initialized');
  }
});

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

// Create an A-Frame scene with a text entity
const scene = document.createElement('a-scene');
const textEntity = document.createElement('a-entity');
textEntity.setAttribute('text', 'value: Hello, Q-DimensionalField!; color: #FFF; width: 6;');
textEntity.setAttribute('position', '0 2 -5');
scene.appendChild(textEntity);
document.body.appendChild(scene);
