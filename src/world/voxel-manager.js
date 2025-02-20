class VoxelManager {
    constructor(blockSize = 1) {
        this.voxelsPerBlock = 8; // 8x8x8 voxels per block
        this.voxelSize = blockSize / this.voxelsPerBlock;
        this.voxels = new Map();
    }

    createVoxel(localPosition, type = 'solid') {
        const voxel = document.createElement('a-entity');
        voxel.setAttribute('voxel', {
            size: this.voxelSize,
            type: type
        });
        voxel.setAttribute('position', `${
            localPosition.x * this.voxelSize
        } ${
            localPosition.y * this.voxelSize
        } ${
            localPosition.z * this.voxelSize
        }`);
        
        const key = `${localPosition.x},${localPosition.y},${localPosition.z}`;
        this.voxels.set(key, voxel);
        return voxel;
    }

    removeVoxel(position) {
        const key = `${position.x},${position.y},${position.z}`;
        const voxel = this.voxels.get(key);
        if (voxel) {
            voxel.parentNode.removeChild(voxel);
            this.voxels.delete(key);
        }
    }
}

export default VoxelManager;
