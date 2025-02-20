import ChunkManager from './chunk-manager.js';
import BlockManager from './block-manager.js';
import VoxelManager from './voxel-manager.js';

class WorldManager {
    constructor() {
        this.chunkManager = new ChunkManager();
        this.blockManager = new BlockManager();
        this.voxelManager = new VoxelManager();
        
        this.setupWorldHierarchy();
        this.loadDistance = 2;
        this.playerPosition = { x: 0, y: 0, z: 0 };
        this.activeChunks = new Set();
    }

    setupWorldHierarchy() {
        // Hierarchy: World -> Chunks -> Blocks -> Voxels
        this.worldSize = {
            chunks: { x: 64, y: 64, z: 64 },    // 64x64x64 chunks
            blocksPerChunk: 16,                  // 16x16x16 blocks per chunk
            voxelsPerBlock: 8                    // 8x8x8 voxels per block
        };
    }

    createBlockInChunk(worldPosition, blockType) {
        const chunk = this.chunkManager.getOrCreateChunk(worldPosition);
        const localPos = this.blockManager.getLocalPosition(worldPosition);
        return this.blockManager.createBlock(chunk, localPos, blockType);
    }

    createVoxelInBlock(worldPosition, voxelType) {
        const block = this.createBlockInChunk(worldPosition);
        const localPos = this.voxelManager.getLocalPosition(worldPosition);
        return this.voxelManager.createVoxel(block, localPos, voxelType);
    }

    update(playerPosition) {
        this.playerPosition = playerPosition;
        this.updateLoadedChunks();
        this.saveWorldState();
    }

    updateLoadedChunks() {
        const chunkPos = this.chunkManager.getChunkPosition(this.playerPosition);
        
        for (let x = -this.loadDistance; x <= this.loadDistance; x++) {
            for (let y = -this.loadDistance; y <= this.loadDistance; y++) {
                for (let z = -this.loadDistance; z <= this.loadDistance; z++) {
                    const pos = {
                        x: chunkPos.x + x,
                        y: chunkPos.y + y,
                        z: chunkPos.z + z
                    };
                    this.loadChunkIfNeeded(pos);
                }
            }
        }
    }

    loadChunkIfNeeded(pos) {
        const key = `${pos.x},${pos.y},${pos.z}`;
        if (!this.activeChunks.has(key)) {
            const chunk = this.chunkManager.createChunk(pos);
            this.activeChunks.add(key);
        }
    }

    saveWorldState() {
        const worldData = {
            chunks: Array.from(this.activeChunks),
            timestamp: Date.now()
        };
        localStorage.setItem('worldState', JSON.stringify(worldData));
    }
}

export default WorldManager;
