import ChunkGenerator from './chunk-generator.js';

class ChunkManager {
    constructor() {
        // Logging flag to enable/disable logging
        const loggingEnabled = true;

        if (loggingEnabled) console.log('Initializing ChunkManager');
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
        // Log the start of the initial chunk spawning process
        if (loggingEnabled) console.log('Spawning initial chunk');
        
        const chunk = document.createElement('a-entity');
        chunk.setAttribute('chunk', {
            position: { x: 0, y: 0, z: 0 },
            size: 5
        });
        chunk.setAttribute('position', '0 0 0');
        chunk.setAttribute('visible', true);
        
        this.container.appendChild(chunk);
        this.chunks.set('0,0,0', chunk);
        
        // Log the details of the created initial chunk
        if (loggingEnabled) console.log('Initial chunk created:', {
            position: chunk.getAttribute('position'),
            containerChildren: this.container.children.length
        });

        // Spawn four neighboring chunks
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
        // Log the start of the plane initialization process
        if (loggingEnabled) console.log('Initializing plane with chunks');
        
        for (let x = -this.renderDistance; x <= this.renderDistance; x++) {
            for (let z = -this.renderDistance; z <= this.renderDistance; z++) {
                this.createChunk({ x, y: 0, z });
            }
        }
    }

    updateChunksAroundPlayer(playerPosition) {
        const chunkPos = this.getChunkPosition(playerPosition);
        
        // Only update if player moved to a new chunk
        if (chunkPos.x !== this.lastPlayerChunkPos.x || 
            chunkPos.z !== this.lastPlayerChunkPos.z) {
            
            this.loadNewChunks(chunkPos);
            this.unloadDistantChunks(chunkPos);
            
            this.lastPlayerChunkPos = { ...chunkPos };
        }
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
        // Log the creation of a chunk at the specified position
        if (loggingEnabled) console.log('Creating chunk at position:', position);
        
        const chunk = document.createElement('a-entity');
        const key = `${position.x},${position.y},${position.z}`;

        const chunkData = ChunkGenerator.generateChunkData(position);
        chunk.setAttribute('chunk', {
            position: position,
            size: this.CHUNK_SIZE,
            chunkData: chunkData
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
        
        // Log the details of the created chunk
        if (loggingEnabled) console.log('Chunk created:', {
            key: key,
            position: chunk.getAttribute('position'),
            containerChildren: this.container.children.length
        });
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

// Create and export instance
const chunkManager = new ChunkManager();
export default chunkManager;
