import * as THREE from 'https://unpkg.com/three@0.149.0/build/three.module.js';
import chunkManager from './managers.js';
import WorldManager from './managers.js';
import ChunkGenerator from './generators.js';

// Register chunk component with proper naming
AFRAME.registerComponent('chunk', {
    schema: {
        chunkId: { type: 'string', default: 'X0Y0Z0' },
        size: { type: 'number', default: 16 }
    },

    init: function() {
        this.blocks = new Map();
        this.generateBlocks();
    },

    generateBlocks: function() {
        const group = new THREE.Group();
        
        // Generate blocks within the chunk (16x16x16)
        for(let x = 0; x < this.data.size; x++) {
            for(let y = 0; y < this.data.size; y++) {
                for(let z = 0; z < this.data.size; z++) {
                    if(Math.random() < 0.2) { // 20% fill rate for testing
                        const block = this.createBlock(x, y, z);
                        group.add(block);
                        this.blocks.set(`${x},${y},${z}`, block);
                    }
                }
            }
        }

        this.el.setObject3D('mesh', group);
        this.el.classList.add('interactive');
    },

    createBlock: function(x, y, z) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({
            color: this.getRandomColor(),
            roughness: 0.7,
            metalness: 0.2
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        return mesh;
    },

    getRandomColor: function() {
        return `#${Math.floor(Math.random()*16777215).toString(16)}`;
    }
});

// Update interaction component name
AFRAME.registerComponent('chunk-interaction', {
    init: function() {
        this.el.addEventListener('click', (e) => {
            const position = e.detail.intersection.point;
            this.createAdjacentChunk(position);
        });
    },

    createAdjacentChunk: function(position) {
        const container = document.querySelector('#world-container');
        const chunk = document.createElement('a-entity');
        
        chunk.setAttribute('chunk', {
            chunkId: `X${position.x}Y${position.y}Z${position.z}`,
            size: 16
        });
        
        chunk.setAttribute('position', position);
        chunk.setAttribute('chunk-interaction', '');
        container.appendChild(chunk);
    }
});

// Initialize world with X0Y0Z0 chunk
function initializeWorld() {
    const container = document.querySelector('#world-container');
    const centerChunk = document.createElement('a-entity');
    
    centerChunk.setAttribute('chunk', {
        chunkId: 'X0Y0Z0',
        size: 16
    });
    
    centerChunk.setAttribute('position', '0 0 0');
    centerChunk.setAttribute('chunk-interaction', '');
    container.appendChild(centerChunk);
}

// Initialize on scene load
document.querySelector('a-scene').addEventListener('loaded', () => {
    initializeWorld();
});

// VR controller integration
AFRAME.registerComponent('controller-interaction', {
    init: function() {
        this.el.addEventListener('triggerdown', function() {
            const raycaster = this.components.raycaster;
            if (raycaster.intersections.length > 0) {
                const intersection = raycaster.intersections[0];
                const chunkInteraction = intersection.object.el.components['chunk-interaction'];
                if (chunkInteraction) {
                    chunkInteraction.createAdjacentChunk(intersection.point);
                }
            }
        });
    }
});
