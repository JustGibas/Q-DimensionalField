import { getBlockType } from '../blocks/block-types.js';

AFRAME.registerComponent('voxel', {
    schema: {
        size: { type: 'number', default: 0.125 },
        typeId: { type: 'number', default: 1 }
    },

    init: function() {
        this.blockType = getBlockType(this.data.typeId);
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
        const blockType = getBlockType(this.data.typeId);
        return blockType.color || '#ffffff';
    },

    updateType: function(newTypeId) {
        this.data.typeId = newTypeId;
        this.blockType = getBlockType(newTypeId);
        this.mesh.material.color.set(this.getVoxelColor());
        this.mesh.material.transparent = this.blockType.transparent || false;
    }
});
