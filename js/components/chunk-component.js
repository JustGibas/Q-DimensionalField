import TextureGenerator from '../utils/texture-generator.js';

AFRAME.registerComponent('voxel-chunk', {
    schema: {
        chunkPosition: { type: 'vec3' },
        size: { type: 'number', default: 16 },
        blocks: { type: 'string', default: '{}' }
    },

    init: function() {
        this.textureGenerator = new TextureGenerator(16);
        this.blocks = typeof this.data.blocks === 'string' ? 
            JSON.parse(this.data.blocks) : this.data.blocks;
        this.blockMeshes = new Map();
        this.createChunk();
    },

    createChunk: function() {
        this.chunkGroup = new THREE.Group();
        Object.entries(this.blocks).forEach(([posKey, blockData]) => {
            this.createBlock(posKey, blockData.type);
        });
        this.el.setObject3D('mesh', this.chunkGroup);
    },

    createBlock: function(posKey, type) {
        const [x, y, z] = posKey.split(',').map(Number);
        
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const texture = this.textureGenerator.generateTexture(type);
        const material = new THREE.MeshStandardMaterial({
            map: new THREE.TextureLoader().load(texture),
            roughness: 0.7,
            metalness: 0.2
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        this.blockMeshes.set(posKey, mesh);
        this.chunkGroup.add(mesh);
    },

    addBlock: function(posKey, type) {
        if (!this.blocks[posKey]) {
            this.blocks[posKey] = { type };
            this.createBlock(posKey, type);
        }
    },

    removeBlock: function(posKey) {
        const mesh = this.blockMeshes.get(posKey);
        if (mesh) {
            this.chunkGroup.remove(mesh);
            this.blockMeshes.delete(posKey);
            delete this.blocks[posKey];
        }
    }
});
