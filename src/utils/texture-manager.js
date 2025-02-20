import TextureGenerator from './texture-generator.js';

class TextureManager {
    constructor() {
        this.textureGenerator = new TextureGenerator(64); // Higher res textures
        this.textureCache = new Map();
        this.loadingPromises = new Map();
    }

    async getTexture(type) {
        if (this.textureCache.has(type)) {
            return this.textureCache.get(type);
        }

        if (this.loadingPromises.has(type)) {
            return this.loadingPromises.get(type);
        }

        const loadingPromise = new Promise((resolve) => {
            const textureData = this.textureGenerator.generateTexture(type);
            const texture = new THREE.TextureLoader().load(textureData, (tex) => {
                tex.wrapS = THREE.RepeatWrapping;
                tex.wrapT = THREE.RepeatWrapping;
                tex.needsUpdate = true;
                this.textureCache.set(type, tex);
                resolve(tex);
            });
        });

        this.loadingPromises.set(type, loadingPromise);
        return loadingPromise;
    }
}

export default TextureManager;
