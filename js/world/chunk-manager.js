class ChunkManager {
    constructor() {
        this.chunks = new Map();
        this.container = document.querySelector('#world-container');
        this.setupEventListeners();
        this.loadSavedState();
    }

    loadSavedState() {
        const savedState = localStorage.getItem('worldState');
        if (savedState) {
            const state = JSON.parse(savedState);
            state.chunks.forEach(chunk => this.createChunk(chunk));
        } else {
            this.generateInitialWorld();
        }
    }

    saveState() {
        const state = {
            chunks: Array.from(this.chunks.values()).map(chunk => ({
                position: chunk.getAttribute('position'),
                type: chunk.getAttribute('voxel-chunk').type
            }))
        };
        localStorage.setItem('worldState', JSON.stringify(state));
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
        const chunkData = typeof type === 'string' ? { type } : type;
        
        chunk.setAttribute('voxel-chunk', {
            position: position,
            size: 1,
            type: chunkData.type
        });
        
        chunk.setAttribute('position', `${position.x} ${position.y} ${position.z}`);
        
        const key = this.getChunkKey(position);
        this.chunks.set(key, chunk);
        this.container.appendChild(chunk);
        this.saveState();
    }

    getChunkKey(position) {
        return `${position.x},${position.y},${position.z}`;
    }

    getRandomType() {
        const types = [
            { type: 'grass' },
            { type: 'stone' },
            { type: 'metal' },
            { type: 'glass' }
        ];
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
