import { TextureManager, TextureGenerator, blockTypeGenerator } from './generators.js';

AFRAME.registerComponent('chunk', {
    schema: {
        position: { type: 'vec3' },
        size: { type: 'number', default: CONFIG.SIZES.CHUNK },
        chunkData: { type: 'array' }
    },

    init: function() {
        const startTime = performance.now();
        Logger.logStep('ChunkComponent', 'Initializing', {
            position: this.data.position,
            size: this.data.size
        });

        this.blocks = new Map();
        this.blockMeshes = new Map();
        this.generateChunk();

        Logger.logPerformance('ChunkComponent', 'initialization', 
            performance.now() - startTime);
    },

    generateChunk: function() {
        const startTime = performance.now();
        Logger.logStep('ChunkComponent', 'Starting chunk generation');
        
        this.chunkGroup = new THREE.Group();
        let blocksCreated = 0;
        
        const size = this.data.size;
        const chunkData = this.data.chunkData;
        
        Logger.logStep('ChunkComponent', 'Chunk parameters', {
            size,
            dataLength: chunkData.length
        });

        // Block creation loop with progress logging
        for(let x = 0; x < size; x++) {
            for(let y = 0; y < size; y++) {
                for(let z = 0; z < size; z++) {
                    const idx = x + y * size + z * size * size;
                    const value = chunkData[idx];
                    
                    if(value > 0.5) { 
                        this.createBlock(x, y, z, { 
                            texture: 'default',
                            color: this.getHeightBasedColor(y, value)
                        });
                        blocksCreated++;
                    }
                }
            }
            
            // Log progress every few layers
            if (x % 5 === 0) {
                Logger.logStep('ChunkComponent', 'Generation progress', {
                    layer: x,
                    blocksCreated
                });
            }
        }

        Logger.logStep('ChunkComponent', 'Chunk generation complete', {
            totalBlocks: blocksCreated,
            position: this.data.position
        });

        this.el.setObject3D('mesh', this.chunkGroup);
        
        Logger.logPerformance('ChunkComponent', 'generateChunk', 
            performance.now() - startTime);
        Logger.logMemory('ChunkComponent', 'generateChunk');
    },

    createBlock(x, y, z, blockType) {
        // Log the creation of a block at the specified position
        if (loggingEnabled) console.log('Creating block at position:', { x, y, z });

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({
            color: blockType.color,
            roughness: 0.7,
            metalness: 0.2
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        
        const key = `${x},${y},${z}`;
        this.blockMeshes.set(key, mesh);
        this.blocks.set(key, blockType);
        this.chunkGroup.add(mesh);
    },

    getRandomColor: function() {
        // Generate a proper 6-digit hex color
        return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    },

    getHeightBasedColor: function(height, value) {
        const hue = (height / this.data.size) * 120; // 0-120 degrees (red to green)
        const saturation = value * 100;
        const lightness = 50 + value * 20;
        const hslColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        
        // Convert HSL to hex
        const hslToHex = (h, s, l) => {
            l /= 100;
            const a = s * Math.min(l, 1 - l) / 100;
            const f = n => {
                const k = (n + h / 30) % 12;
                const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
                return Math.round(255 * color).toString(16).padStart(2, '0'); // convert to Hex and prefix "0" if needed
            };
            return `#${f(0)}${f(8)}${f(4)}`;
        };

        return hslToHex(hue, saturation, lightness);
    },

    addPlaneToChunk: function() {
        // Log the start of the plane addition process
        if (loggingEnabled) console.log('Adding plane to chunk');

        const geometry = new THREE.PlaneGeometry(this.data.size, this.data.size);
        let material;

        // Generate texture or random color for the plane
        const textureType = 'grass'; // Example texture type
        const textureData = this.textureGenerator.generateTexture(textureType);

        if (textureData) {
            const texture = new THREE.TextureLoader().load(textureData);
            material = new THREE.MeshStandardMaterial({ map: texture });
        } else {
            const color = this.getRandomColor();
            material = new THREE.MeshStandardMaterial({ color: color });
        }

        const plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = -Math.PI / 2; // Rotate plane to be horizontal
        plane.position.set(this.data.size / 2, 0, this.data.size / 2);

        this.chunkGroup.add(plane);

        // Log the completion of the plane addition process
        if (loggingEnabled) console.log('Plane added to chunk');
    }
});

AFRAME.registerComponent('loading-screen', {
    init: function() {
        // Logging flag to enable/disable logging
        const loggingEnabled = true;

        if (loggingEnabled) console.log('Initializing loading screen component');
        this.loadingScreen = document.querySelector('#loading-screen');
        this.loadingText = this.loadingScreen.querySelector('.loader');
        this.setupLoadingManager();
    },

    setupLoadingManager: function() {
        // Log the setup of the loading manager
        if (loggingEnabled) console.log('Setting up loading manager');

        THREE.DefaultLoadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            const progress = (itemsLoaded / itemsTotal * 100).toFixed(0);
            this.loadingText.textContent = `Loading textures... ${progress}%`;

            // Log the loading progress
            if (loggingEnabled) console.log(`Loading progress: ${progress}%`);
        };

        THREE.DefaultLoadingManager.onLoad = () => {
            // Log the completion of loading
            if (loggingEnabled) console.log('Loading complete');

            setTimeout(() => {
                this.loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    this.loadingScreen.style.display = 'none';
                }, 500);
            }, 1000);
        };
    }
});

AFRAME.registerComponent('voxel', {
    schema: {
        size: { type: 'number', default: CONFIG.SIZES.VOXEL },
        typeId: { type: 'number', default: 1 }
    },

    init: function() {
        this.blockType = blockTypeGenerator.getBlockType(this.data.typeId);
        this.createVoxel();
    },

    createVoxel: function() {
        const geometry = new THREE.BoxGeometry(
            this.data.size,
            this.data.size,
            this.data.size
        );
        
        const material = new THREE.MeshStandardMaterial({
            color: this.getVoxelColor(),
            roughness: 0.7,
            metalness: 0.2
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.el.setObject3D('mesh', this.mesh);
    },

    getVoxelColor: function() {
        const blockType = blockTypeGenerator.getBlockType(this.data.typeId);
        return blockType.color || '#ffffff';
    },

    updateType: function(newTypeId) {
        this.data.typeId = newTypeId;
        this.blockType = blockTypeGenerator.getBlockType(newTypeId);
        this.mesh.material.color.set(this.getVoxelColor());
        this.mesh.material.transparent = this.blockType.transparent || false;
    }
});
