class ChunkGenerator {
    constructor() {
        this.noise = this.createSimpleNoise();
    }

    createSimpleNoise() {
        // Simple 3D noise function without Taichi dependency
        return (x, y, z, seed = 0) => {
            const X = Math.floor(x) & 255;
            const Y = Math.floor(y) & 255;
            const Z = Math.floor(z) & 255;
            
            const hash = ((X + seed) * 12.9898 + (Y + seed) * 78.233 + (Z + seed) * 45.164) % 1;
            return Math.sin(hash * 43758.5453123) * 0.5 + 0.5;
        };
    }

    generateChunkData(position, size = 16) {
        const seed = position.x * 10000 + position.z * 100;
        const chunkData = new Float32Array(size * size * size);
        
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                for (let z = 0; z < size; z++) {
                    const idx = x + y * size + z * size * size;
                    chunkData[idx] = this.noise(
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
