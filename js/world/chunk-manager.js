class ChunkManager {
    constructor() {
        this.chunks = new Map();
        this.container = document.querySelector('#world-container');
        this.setupEventListeners();
        this.generateInitialWorld();
    }

    generateInitialWorld() {
        const size = 5;
        for (let x = -size; x <= size; x++) {
            for (let z = -size; z <= size; z++) {
                this.createChunk({
                    position: { x, y: 0, z },
                    type: this.getRandomType()
                });
            }
        }
    }

    createChunk({ position, type = 'default' }) {
        const chunk = document.createElement('a-entity');
        const chunkSize = 1;
        
        chunk.setAttribute('voxel-chunk', {
            position: position,
            size: chunkSize,
            type: type
        });
        
        chunk.setAttribute('position', `${position.x} ${position.y} ${position.z}`);
        
        const key = this.getChunkKey(position);
        this.chunks.set(key, chunk);
        this.container.appendChild(chunk);
    }

    getChunkKey(position) {
        return `${position.x},${position.y},${position.z}`;
    }

    getRandomType() {
        const types = ['grass', 'stone', 'water'];
        return types[Math.floor(Math.random() * types.length)];
    }

    setupEventListeners() {
        this.container.addEventListener('chunk-clicked', (event) => {
            const pos = event.detail.position;
            this.createChunk({
                position: { 
                    x: pos.x, 
                    y: pos.y + 1, 
                    z: pos.z 
                },
                type: this.getRandomType()
            });
        });
    }
}

// Initialize the chunk manager when the scene is loaded
document.querySelector('a-scene').addEventListener('loaded', () => {
    window.chunkManager = new ChunkManager();
});
