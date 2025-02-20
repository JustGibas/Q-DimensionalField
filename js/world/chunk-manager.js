class ChunkManager {
    constructor() {
        this.chunks = new Map();
        this.CHUNK_SIZE = 16; // 16x16x16 blocks per chunk
        this.container = document.querySelector('#world-container');
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

export default ChunkManager;
