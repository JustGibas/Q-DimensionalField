import * as THREE from 'https://unpkg.com/three@0.149.0/build/three.module.js';
import { CONFIG, Logger } from './config.js';
import { WorldManager, ChunkManager } from './managers.js';
import { blockTypeGenerator } from './generators.js';

// Log initialization
Logger.info('Game', `Initializing game version ${CONFIG.VERSIONS.GAME}`);
Logger.info('Game', `Using Three.js ${CONFIG.VERSIONS.THREE}`);
Logger.info('Game', `Using A-Frame ${CONFIG.VERSIONS.AFRAME}`);

AFRAME.registerComponent('chunk', {
    schema: {
        chunkId: { type: 'string', default: 'X0Y0Z0' },
        size: { type: 'number', default: 16 }
    },

    init: function() {
        Logger.debug('ChunkComponent', `Initializing chunk ${this.data.chunkId}`, {
            version: CONFIG.VERSIONS.CHUNK_COMPONENT,
            size: this.data.size
        });
        this.blocks = new Map();
        this.generateBlocks();
    },

    generateBlocks: function() {
        Logger.debug('ChunkComponent', `Generating blocks for ${this.data.chunkId}`);
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

AFRAME.registerComponent('chunk-interaction', {
    init: function() {
        Logger.debug('InteractionComponent', 'Initializing', {
            version: CONFIG.VERSIONS.INTERACTION_COMPONENT
        });
        this.el.addEventListener('click', (e) => {
            const position = e.detail.intersection.point;
            this.createAdjacentChunk(position);
        });
    },

    createAdjacentChunk: function(position) {
        Logger.debug('InteractionComponent', 'Creating adjacent chunk', { position });
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

function initializeWorld() {
    Logger.info('Game', 'Initializing world');
    try {
        const container = document.querySelector('#world-container');
        const centerChunk = document.createElement('a-entity');
        
        centerChunk.setAttribute('chunk', {
            chunkId: 'X0Y0Z0',
            size: 16
        });
        
        centerChunk.setAttribute('position', '0 0 0');
        centerChunk.setAttribute('chunk-interaction', '');
        container.appendChild(centerChunk);
        Logger.info('Game', 'World initialized successfully');
    } catch (error) {
        Logger.error('Game', 'Failed to initialize world', error);
    }
}

// Performance monitoring
if (CONFIG.LOGGING.performance) {
    const perfMonitor = {
        start: (label) => {
            performance.mark(`${label}-start`);
        },
        end: (label) => {
            performance.mark(`${label}-end`);
            performance.measure(label, `${label}-start`, `${label}-end`);
            const measure = performance.getEntriesByName(label)[0];
            Logger.debug('Performance', `${label}: ${measure.duration.toFixed(2)}ms`);
        }
    };
    window.perfMonitor = perfMonitor;
}

document.querySelector('a-scene').addEventListener('loaded', () => {
    Logger.info('Game', 'A-Frame scene loaded');
    
    // Initialize world immediately after scene loads
    initializeWorld();
    
    // Start chunk generation
    const worldManager = new WorldManager();
    const initialChunk = worldManager.chunkManager.spawnInitialChunk();
    
    if (initialChunk) {
        Logger.info('Game', 'Initial chunk created successfully');
    } else {
        Logger.error('Game', 'Failed to create initial chunk');
    }

    // Force immediate chunk updates
    worldManager.chunkManager.updateChunksAroundPlayer({x: 0, y: 1, z: 0});
});

// Add error handling
window.addEventListener('error', (event) => {
    Logger.error('Game', 'Runtime error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno
    });
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
