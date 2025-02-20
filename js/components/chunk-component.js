import TextureManager from '../utils/texture-manager.js';
import { BlockTypes } from '../blocks/block-types.js';

AFRAME.registerComponent('chunk', {
    schema: {
        chunkPosition: { type: 'vec3' },
        size: { type: 'number', default: 16 },
        blocks: { type: 'string', default: '{}' }
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
        
        // Generate blocks within the chunk (16x16x16)
        for(let x = 0; x < this.data.size; x++) {
            for(let y = 0; y < this.data.size; y++) {
                for(let z = 0; z < this.data.size; z++) {
                    if(Math.random() < 0.2) { // 20% fill rate for testing
                        this.createBlock(x, y, z, { 
                            texture: 'default',
                            color: this.getRandomColor() 
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
        // Temporary: Use basic material until texture system is fixed
        const material = new THREE.MeshStandardMaterial({
            color: blockType.color || '#ffffff',
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
        return `#${Math.floor(Math.random()*16777215).toString(16)}`;
    }
});
