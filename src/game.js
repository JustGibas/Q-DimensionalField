import * as THREE from 'https://unpkg.com/three@0.149.0/build/three.module.js';

// Register a custom A-Frame component for voxel chunks
AFRAME.registerComponent('voxel-chunk', {
    schema: {
        position: { type: 'vec3' },
        size: { type: 'number', default: 1 }
    },

    init: function() {
        this.createChunk();
    },

    createChunk: function() {
        const size = this.data.size;
        const geometry = new THREE.BoxGeometry(size, size, size);
        const material = new THREE.MeshStandardMaterial({
            color: '#' + Math.floor(Math.random()*16777215).toString(16),
            roughness: 0.7,
            metalness: 0.2
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.el.setObject3D('mesh', this.mesh);
        this.el.classList.add('interactive');
    }
});

// Register interaction component
AFRAME.registerComponent('chunk-interaction', {
    init: function() {
        this.el.addEventListener('click', (e) => {
            const position = e.detail.intersection.point;
            createNewChunk(position);
        });
    }
});

// Create initial voxel grid
function createInitialGrid() {
    const container = document.querySelector('#game-container');
    
    for (let x = -2; x <= 2; x++) {
        for (let y = 0; y <= 4; y++) {
            for (let z = -2; z <= 2; z++) {
                const chunk = document.createElement('a-entity');
                chunk.setAttribute('voxel-chunk', {
                    position: { x: x, y: y, z: z },
                    size: 0.5
                });
                chunk.setAttribute('position', `${x} ${y} ${z}`);
                chunk.setAttribute('chunk-interaction', '');
                container.appendChild(chunk);
            }
        }
    }
}

// Function to create new chunks when clicking
function createNewChunk(position) {
    const container = document.querySelector('#game-container');
    const chunk = document.createElement('a-entity');
    chunk.setAttribute('voxel-chunk', {
        position: position,
        size: 0.5
    });
    chunk.setAttribute('position', position);
    chunk.setAttribute('chunk-interaction', '');
    container.appendChild(chunk);
}

// Initialize the game when the scene is loaded
document.querySelector('a-scene').addEventListener('loaded', () => {
    createInitialGrid();
});

// Add VR specific interactions
AFRAME.registerComponent('controller-interaction', {
    init: function() {
        this.el.addEventListener('triggerdown', function() {
            // Trigger VR controller interaction
            const raycaster = this.components.raycaster;
            if (raycaster.intersections.length > 0) {
                const intersection = raycaster.intersections[0];
                createNewChunk(intersection.point);
            }
        });
    }
});
