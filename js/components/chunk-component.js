import TextureManager from '../utils/texture-manager.js';
import { BlockTypes } from '../blocks/block-types.js';

AFRAME.registerComponent('chunk', {
    schema: {
        position: { type: 'vec3' },
        size: { type: 'number', default: 16 },
        chunkData: { type: 'array' }
    },

    init: function() {
        console.log('Initializing chunk component:', this.data);
        this.textureManager = new TextureManager();
        this.blocks = new Map();
        this.blockMeshes = new Map();
        this.generateChunk();
    },

    generateChunk: function() {
        console.log('Generating chunk at position:', this.el.getAttribute('position'));
        this.chunkGroup = new THREE.Group();
        let blocksCreated = 0;
        
        const size = this.data.size;
        const chunkData = this.data.chunkData;
        
        for(let x = 0; x < size; x++) {
            for(let y = 0; y < size; y++) {
                for(let z = 0; z < size; z++) {
                    const idx = x + y * size + z * size * size;
                    const value = chunkData[idx];
                    
                    if(value > 0.5) { // Threshold for block creation
                        this.createBlock(x, y, z, { 
                            texture: 'default',
                            color: this.getHeightBasedColor(y, value)
                        });
                        blocksCreated++;
                    }
                }
            }
        }

        console.log(`Created ${blocksCreated} blocks in chunk`);
        this.el.setObject3D('mesh', this.chunkGroup);
        this.el.classList.add('interactive');
    },

    createBlock(x, y, z, blockType) {
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
        // Generate proper 6-digit hex color
        return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    },

    getHeightBasedColor: function(height, value) {
        const hue = (height / this.data.size) * 120; // 0-120 degrees (red to green)
        const saturation = value * 100;
        const lightness = 50 + value * 20;
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }
});
