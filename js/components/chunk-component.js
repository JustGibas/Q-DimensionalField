import TextureManager from '../utils/texture-manager.js';
import { BlockTypes } from '../blocks/block-types.js';

AFRAME.registerComponent('chunk', {
    schema: {
        chunkPosition: { type: 'vec3' },
        size: { type: 'number', default: 16 },
        blocks: { type: 'string', default: '{}' }
    },

    init: function() {
        this.textureManager = new TextureManager();
        this.blocks = new Map();
        this.blockMeshes = new Map();
        this.generateChunk();
    },

    generateChunk: function() {
        this.chunkGroup = new THREE.Group();
        
        // Generate blocks within the chunk (16x16x16)
        for(let x = 0; x < this.data.size; x++) {
            for(let y = 0; y < this.data.size; y++) {
                for(let z = 0; z < this.data.size; z++) {
                    if(Math.random() < 0.2) { // 20% fill rate for testing
                        this.createBlock(x, y, z, this.getRandomBlockType());
                    }
                }
            }
        }

        this.el.setObject3D('mesh', this.chunkGroup);
        this.el.classList.add('interactive');
    },

    async createBlock(x, y, z, blockType) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const texture = await this.textureManager.getTexture(blockType.texture);
        
        const material = new THREE.MeshStandardMaterial({
            map: texture,
            transparent: blockType.transparent || false,
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

    getRandomBlockType() {
        const types = Object.values(BlockTypes).filter(type => type.id !== 0); // Exclude AIR
        return types[Math.floor(Math.random() * types.length)];
    }
});
