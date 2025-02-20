import { TextureManager, TextureGenerator, chunkGenerator } from './generators.js';
import { CONFIG, Logger } from './config.js';

class ChunkManager {
    constructor() {
        Logger.info('ChunkManager', 'Initializing', { version: CONFIG.VERSIONS.CHUNK_MANAGER });
        this.chunks = new Map();
        this.CHUNK_SIZE = 10; // 10x10x10 blocks per chunk
        this.container = document.querySelector('#world-container');
        if (!this.container) {
            console.error('Could not find world-container element!');
            return;
        }
        this.renderDistance = 2; // Number of chunks to render in each direction
        this.lastPlayerChunkPos = { x: 0, z: 0 };
        this.spawnInitialChunk();
        this.initializePlane();
    }

    spawnInitialChunk() {
        const chunkData = chunkGenerator.generateChunkData({ x: 0, y: 0, z: 0 });
        const chunk = document.createElement('a-entity');
        chunk.setAttribute('chunk', {
            position: { x: 0, y: 0, z: 0 },
            size: this.CHUNK_SIZE,
            chunkData: chunkData
        });
        chunk.setAttribute('position', '0 0 0');
        chunk.setAttribute('visible', true);
        
        this.container.appendChild(chunk);
        this.chunks.set('0,0,0', chunk);

        this.spawnNeighboringChunks({ x: 0, y: 0, z: 0 });
    }

    spawnNeighboringChunks(centerChunkPos) {
        const neighbors = [
            { x: centerChunkPos.x + 1, y: centerChunkPos.y, z: centerChunkPos.z },
            { x: centerChunkPos.x - 1, y: centerChunkPos.y, z: centerChunkPos.z },
            { x: centerChunkPos.x, y: centerChunkPos.y, z: centerChunkPos.z + 1 },
            { x: centerChunkPos.x, y: centerChunkPos.y, z: centerChunkPos.z - 1 }
        ];

        for (const pos of neighbors) {
            const key = `${pos.x},${pos.y},${pos.z}`;
            if (!this.chunks.has(key)) {
                this.createChunk(pos);
            }
        }
    }

    initializePlane() {
        for (let x = -this.renderDistance; x <= this.renderDistance; x++) {
            for (let z = -this.renderDistance; z <= this.renderDistance; z++) {
                this.createChunk({ x, y: 0, z });
            }
        }
    }

    updateChunksAroundPlayer(playerPosition) {
        const startTime = performance.now();
        Logger.logStep('ChunkManager', 'Updating chunks around player', { playerPosition });

        const chunkPos = this.getChunkPosition(playerPosition);
        Logger.logStep('ChunkManager', 'Calculated chunk position', { chunkPos });
        
        if (chunkPos.x !== this.lastPlayerChunkPos.x || 
            chunkPos.z !== this.lastPlayerChunkPos.z) {
            
            Logger.logStep('ChunkManager', 'Player moved to new chunk', {
                from: this.lastPlayerChunkPos,
                to: chunkPos
            });
            
            this.loadNewChunks(chunkPos);
            this.unloadDistantChunks(chunkPos);
            
            this.lastPlayerChunkPos = { ...chunkPos };
        }

        Logger.logPerformance('ChunkManager', 'updateChunksAroundPlayer', 
            performance.now() - startTime);
    }

    loadNewChunks(centerChunkPos) {
        for (let x = -this.renderDistance; x <= this.renderDistance; x++) {
            for (let z = -this.renderDistance; z <= this.renderDistance; z++) {
                const pos = {
                    x: centerChunkPos.x + x,
                    y: 0,
                    z: centerChunkPos.z + z
                };
                const key = `${pos.x},${pos.y},${pos.z}`;
                
                if (!this.chunks.has(key)) {
                    this.createChunk(pos);
                }
            }
        }
    }

    unloadDistantChunks(centerChunkPos) {
        for (const [key, chunk] of this.chunks) {
            const [x, y, z] = key.split(',').map(Number);
            const distance = Math.max(
                Math.abs(x - centerChunkPos.x),
                Math.abs(z - centerChunkPos.z)
            );
            
            if (distance > 3) {
                this.container.removeChild(chunk);
                this.chunks.delete(key);
            }
        }
    }

    createChunk(position) {
        const startTime = performance.now();
        Logger.logStep('ChunkManager', 'Creating new chunk', { position });

        const chunkData = chunkGenerator.generateChunkData(position);
        Logger.logStep('ChunkManager', 'Generated chunk data', { 
            dataSize: chunkData.length,
            position 
        });

        const chunk = document.createElement('a-entity');
        const key = `${position.x},${position.y},${position.z}`;

        chunk.setAttribute('chunk', {
            position: position,
            size: this.CHUNK_SIZE,
            chunkData: chunkData
        });

        Logger.logStep('ChunkManager', 'Setting chunk position', {
            worldX: position.x * this.CHUNK_SIZE * 16,
            worldY: position.y * this.CHUNK_SIZE * 16,
            worldZ: position.z * this.CHUNK_SIZE * 16
        });

        chunk.setAttribute('position', `${
            position.x * this.CHUNK_SIZE * 16
        } ${
            position.y * this.CHUNK_SIZE * 16
        } ${
            position.z * this.CHUNK_SIZE * 16
        }`);

        this.chunks.set(key, chunk);
        this.container.appendChild(chunk);

        Logger.logStep('ChunkManager', 'Chunk created', { 
            key,
            totalChunks: this.chunks.size 
        });
        
        Logger.logPerformance('ChunkManager', 'createChunk', performance.now() - startTime);
        Logger.logMemory('ChunkManager', 'createChunk');

        return chunk;
    }

    getOrCreateChunk(worldPosition) {
        const chunkPos = this.getChunkPosition(worldPosition);
        const key = `${chunkPos.x},${chunkPos.y},${chunkPos.z}`;
        
        if (!this.chunks.has(key)) {
            return this.createChunk(chunkPos);
        }
        return this.chunks.get(key);
    }

    getChunkPosition(worldPos) {
        return {
            x: Math.floor(worldPos.x / (this.CHUNK_SIZE * 16)),
            y: Math.floor(worldPos.y / (this.CHUNK_SIZE * 16)),
            z: Math.floor(worldPos.z / (this.CHUNK_SIZE * 16))
        };
    }
}

class VoxelManager {
    constructor(blockSize = 1) {
        Logger.info('VoxelManager', `Initializing version ${CONFIG.VERSIONS.VOXEL_MANAGER}`);
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

class WorldManager {
    constructor() {
        Logger.info('WorldManager', `Initializing version ${CONFIG.VERSIONS.WORLD_MANAGER}`);
        this.chunkManager = new ChunkManager();
    }

    // Add manager methods here
}

/* Taichi.js Integration Placeholder
export class TaichiManager {
    constructor() {
        Logger.warn('TaichiManager', 'Taichi.js integration not implemented yet');
    }
}
*/

export { ChunkManager, VoxelManager, WorldManager };
