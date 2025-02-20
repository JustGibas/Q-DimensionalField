class ChunkGenerator {
    constructor() {
        this.initTaichi();
    }

    async initTaichi() {
        this.taichi = await window.taichi.init();
        
        // Kernel for generating chunk data
        this.generateChunkKernel = this.taichi.kernel((x, y, z, seed) => {
            // Simplified 2D Perlin-like noise
            const hash = (x * 12.9898 + y * 78.233 + z * 45.164 + seed) * 43758.5453;
            return Math.sin(hash) * 0.5 + 0.5;
        });
    }

    generateChunkData(position, size = 16) {
        const seed = position.x * 10000 + position.z * 100; // Ignore Y for plane generation
        const chunkData = new Float32Array(size * size * size);
        
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                for (let z = 0; z < size; z++) {
                    const idx = x + y * size + z * size * size;
                    chunkData[idx] = this.generateChunkKernel(
                        x + position.x * size,
                        y,
                        z + position.z * size,
                        seed
                    );
                }
            }
        }
        
        return chunkData;
    }
}

export default new ChunkGenerator();
