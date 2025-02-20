class ChunkManager {
    constructor() {
        console.log('Initializing ChunkManager');
        this.chunks = new Map();
        this.CHUNK_SIZE = 16; // 16x16x16 blocks per chunk
        this.container = document.querySelector('#world-container');
        if (!this.container) {
            console.error('Could not find world-container element!');
            return;
        }
        this.spawnInitialChunk();
    }

    spawnInitialChunk() {
        console.log('Spawning initial chunk');
        const chunk = document.createElement('a-entity');
        chunk.setAttribute('chunk', {
            chunkId: 'X0Y0Z0',
            size: 16
        });
        chunk.setAttribute('position', '0 0 0');
        chunk.setAttribute('visible', true);
        
        this.container.appendChild(chunk);
        this.chunks.set('X0Y0Z0', chunk);
    }

    createChunk(position) {
        const chunk = document.createElement('a-entity');
        const key = `${position.x},${position.y},${position.z}`;

        chunk.setAttribute('chunk', {
            position: position,
            size: this.CHUNK_SIZE
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
