import { CONFIG, Logger } from './config.js';
import { WorldManager, ChunkManager, UIManager } from './managers.js';
import { blockTypeGenerator } from './generators.js';

// Remove direct THREE import, use AFRAME.THREE instead
Logger.info('Game', `Initializing game version ${CONFIG.VERSIONS.GAME}`);
Logger.info('Game', `Using Three.js ${CONFIG.VERSIONS.THREE}`);
Logger.info('Game', `Using A-Frame ${CONFIG.VERSIONS.AFRAME}`);

AFRAME.registerComponent('chunk', {
    schema: {
        chunkId: { type: 'string', default: 'X0Y0Z0' },
        size: { type: 'number', default: CONFIG.SIZES.CHUNK },
        position: { type: 'vec3' },
        chunkData: { type: 'array' }
    },

    init: function() {
        if (!CONFIG.FLAGS.ENABLE_CHUNK_GENERATION) {
            Logger.info('ChunkComponent', 'Chunk generation disabled by flag');
            return;
        }

        this.blocks = new Map();
        this.generateDebugGeometry();
    },

    // Update generate methods to use AFRAME.THREE
    generateDebugGeometry: function() {
        if (CONFIG.FLAGS.SHOW_CHUNK_BOUNDS) {
            // Create wireframe box to show chunk bounds
            const geometry = new AFRAME.THREE.BoxGeometry(
                this.data.size, 
                this.data.size, 
                this.data.size
            );
            const material = new AFRAME.THREE.MeshBasicMaterial({
                wireframe: true,
                color: 0x00ff00
            });
            const mesh = new AFRAME.THREE.Mesh(geometry, material);
            mesh.position.set(
                this.data.size/2, 
                this.data.size/2, 
                this.data.size/2
            );
            const group = new AFRAME.THREE.Group();
            group.add(mesh);
            this.el.setObject3D('mesh', group);
            return;
        }

        if (CONFIG.DEBUG_OPTIONS.TEST_MODE === 'EMPTY') {
            return;
        }

        if (CONFIG.DEBUG_OPTIONS.TEST_MODE === 'SINGLE_BLOCK') {
            this.generateSingleBlock();
            return;
        }

        if (CONFIG.FLAGS.SIMPLE_GEOMETRY) {
            this.generateSimpleGeometry();
            return;
        }

        // Only generate blocks if explicitly enabled
        if (CONFIG.FLAGS.ENABLE_BLOCK_GENERATION) {
            this.generateBlocks();
        }
    },

    createBlock: function(x, y, z) {
        Logger.debug('ChunkComponent', 'Creating block at position:', { x, y, z });

        const geometry = new AFRAME.THREE.BoxGeometry(1, 1, 1);
        const material = new AFRAME.THREE.MeshStandardMaterial({
            color: this.getRandomColor(),
            roughness: 0.7,
            metalness: 0.2
        });

        const mesh = new AFRAME.THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        
        const key = `${x},${y},${z}`;
        this.blockMeshes.set(key, mesh);
        this.blocks.set(key, true);
        this.chunkGroup.add(mesh);
    },

    generateSingleBlock: function() {
        const geometry = new AFRAME.THREE.BoxGeometry(1, 1, 1);
        const material = new AFRAME.THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: CONFIG.FLAGS.WIREFRAME_MODE
        });
        const mesh = new AFRAME.THREE.Mesh(geometry, material);
        mesh.position.set(0, 0, 0);
        const group = new AFRAME.THREE.Group();
        group.add(mesh);
        this.el.setObject3D('mesh', group);
    },

    generateSimpleGeometry: function() {
        const geometry = new AFRAME.THREE.BoxGeometry(
            this.data.size, 
            this.data.size, 
            this.data.size
        );
        const material = new AFRAME.THREE.MeshBasicMaterial({
            color: 0x808080,
            wireframe: CONFIG.FLAGS.WIREFRAME_MODE,
            transparent: true,
            opacity: 0.5
        });
        const mesh = new AFRAME.THREE.Mesh(geometry, material);
        mesh.position.set(
            this.data.size/2, 
            this.data.size/2, 
            this.data.size/2
        );
        const group = new AFRAME.THREE.Group();
        group.add(mesh);
        this.el.setObject3D('mesh', group);
    },

    generateBlocks: function() {
        Logger.debug('ChunkComponent', `Generating blocks for ${this.data.chunkId}`);
        const group = new AFRAME.THREE.Group();
        
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

class GameInitializer {
    constructor() {
        this.initPromise = null;
        this.sceneElement = document.querySelector('a-scene');
        this.loadingScreen = document.querySelector('#loading-screen');
        this.initialized = false;
    }

    async initialize() {
        if (this.initPromise) return this.initPromise;

        this.initPromise = new Promise(async (resolve, reject) => {
            try {
                Logger.info('GameInitializer', 'Starting initialization');
                
                // Wait for scene to be ready
                await this.waitForScene();
                
                // Initialize managers
                this.uiManager = new UIManager();
                this.worldManager = new WorldManager();

                // Wait for player rig to be ready
                await this.waitForPlayer();
                
                // Initialize world after player is ready
                await this.initializeWorld();
                
                // Remove loading screen with fade
                this.fadeOutLoadingScreen();
                
                this.initialized = true;
                CONFIG.FLAGS.SCENE_READY = true;
                Logger.info('GameInitializer', 'Initialization complete');
                resolve();
            } catch (error) {
                Logger.error('GameInitializer', 'Initialization failed', error);
                reject(error);
            }
        });

        return this.initPromise;
    }

    waitForScene() {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Scene loading timed out'));
            }, CONFIG.LOADING.TIMEOUT);

            if (this.sceneElement.hasLoaded) {
                clearTimeout(timeout);
                resolve();
            } else {
                this.sceneElement.addEventListener('loaded', () => {
                    clearTimeout(timeout);
                    resolve();
                });
            }
        });
    }

    waitForPlayer() {
        return new Promise((resolve, reject) => {
            const playerRig = document.querySelector('#player-rig');
            const camera = playerRig.querySelector('a-camera');
            
            const timeout = setTimeout(() => {
                reject(new Error('Player loading timed out'));
            }, CONFIG.LOADING.TIMEOUT);

            if (camera.hasLoaded) {
                clearTimeout(timeout);
                resolve();
            } else {
                camera.addEventListener('loaded', () => {
                    clearTimeout(timeout);
                    resolve();
                });
            }
        });
    }

    async initializeWorld() {
        Logger.info('GameInitializer', 'Initializing world');
        try {
            const container = document.querySelector('#world-container');
            const initialChunk = await this.worldManager.chunkManager.spawnInitialChunk();
            
            if (initialChunk) {
                Logger.info('GameInitializer', 'Initial chunk created successfully');
                this.uiManager.updateDebugInfo({
                    'chunk-count': '1',
                    'last-chunk-name': 'Initial Chunk'
                });
            }
        } catch (error) {
            Logger.error('GameInitializer', 'Failed to initialize world', error);
            throw error;
        }
    }

    fadeOutLoadingScreen() {
        const minLoadTime = new Promise(resolve => 
            setTimeout(resolve, CONFIG.LOADING.MINIMUM_TIME)
        );

        minLoadTime.then(() => {
            this.loadingScreen.style.transition = `opacity ${CONFIG.LOADING.FADE_DURATION}ms`;
            this.loadingScreen.style.opacity = '0';
            
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
            }, CONFIG.LOADING.FADE_DURATION);
        });
    }
}

// Initialize game when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    const game = new GameInitializer();
    game.initialize().catch(error => {
        Logger.error('Game', 'Failed to initialize game', error);
        // Show error in loading screen
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.textContent = 'Failed to initialize game. Please refresh.';
        }
    });
});

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
