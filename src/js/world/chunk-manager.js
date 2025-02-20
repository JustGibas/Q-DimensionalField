AFRAME.registerComponent('chunk-manager', {
    schema: {
        chunkSize: { type: 'number', default: 16 },
        loadDistance: { type: 'number', default: 2 },
        unloadDistance: { type: 'number', default: 3 }
    },

    init: function() {
        this.loadedChunks = new Map();
        this.playerPosition = new THREE.Vector3(0, 0, 0);
        this.updateChunks();
    },

    tick: function() {
        const playerRig = document.querySelector('#player-rig');
        const playerPos = playerRig.getAttribute('position');
        this.playerPosition.set(playerPos.x, playerPos.y, playerPos.z);
        this.updateChunks();
    },

    updateChunks: function() {
        const chunkSize = this.data.chunkSize;
        const loadDistance = this.data.loadDistance;
        const unloadDistance = this.data.unloadDistance;

        const playerChunkX = Math.floor(this.playerPosition.x / chunkSize);
        const playerChunkY = Math.floor(this.playerPosition.y / chunkSize);
        const playerChunkZ = Math.floor(this.playerPosition.z / chunkSize);

        const chunksToLoad = new Set();
        const chunksToUnload = new Set(this.loadedChunks.keys());

        for (let x = playerChunkX - loadDistance; x <= playerChunkX + loadDistance; x++) {
            for (let y = playerChunkY - loadDistance; y <= playerChunkY + loadDistance; y++) {
                for (let z = playerChunkZ - loadDistance; z <= playerChunkZ + loadDistance; z++) {
                    const chunkId = `X${x}Y${y}Z${z}`;
                    chunksToLoad.add(chunkId);
                    chunksToUnload.delete(chunkId);
                }
            }
        }

        chunksToUnload.forEach(chunkId => {
            const chunk = this.loadedChunks.get(chunkId);
            if (chunk) {
                chunk.parentNode.removeChild(chunk);
                this.loadedChunks.delete(chunkId);
            }
        });

        chunksToLoad.forEach(chunkId => {
            if (!this.loadedChunks.has(chunkId)) {
                const chunk = document.createElement('a-entity');
                chunk.setAttribute('chunk', {
                    chunkId: chunkId,
                    size: chunkSize
                });
                chunk.setAttribute('position', this.getChunkPosition(chunkId));
                chunk.setAttribute('chunk-interaction', '');
                this.el.appendChild(chunk);
                this.loadedChunks.set(chunkId, chunk);
            }
        });
    },

    getChunkPosition: function(chunkId) {
        const matches = chunkId.match(/X(-?\d+)Y(-?\d+)Z(-?\d+)/);
        if (matches) {
            const x = parseInt(matches[1], 10) * this.data.chunkSize;
            const y = parseInt(matches[2], 10) * this.data.chunkSize;
            const z = parseInt(matches[3], 10) * this.data.chunkSize;
            return `${x} ${y} ${z}`;
        }
        return '0 0 0';
    }
});
