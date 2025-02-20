class TextureGenerator {
    constructor(resolution = 16) {
        this.resolution = resolution;
        this.canvas = document.createElement('canvas');
        this.canvas.width = resolution;
        this.canvas.height = resolution;
        this.ctx = this.canvas.getContext('2d');
    }

    generateTexture(type) {
        this.ctx.clearRect(0, 0, this.resolution, this.resolution);
        
        switch(type) {
            case 'grass':
                return this.generateGrassTexture();
            case 'stone':
                return this.generateStoneTexture();
            case 'metal':
                return this.generateMetalTexture();
            case 'glass':
                return this.generateGlassTexture();
            default:
                return this.generateDefaultTexture();
        }
    }

    generateGrassTexture() {
        const colors = ['#2d5a27', '#1e4d1a', '#387031', '#2d5a27'];
        this.drawNoise(colors, 0.7);
        return this.getTextureData();
    }

    generateStoneTexture() {
        const colors = ['#666666', '#777777', '#555555', '#707070'];
        this.drawNoise(colors, 0.3);
        return this.getTextureData();
    }

    generateMetalTexture() {
        const colors = ['#95a5a6', '#7f8c8d', '#bdc3c7'];
        this.drawNoise(colors, 0.1);
        return this.getTextureData();
    }

    generateGlassTexture() {
        const colors = ['#ecf0f1', '#bdc3c7'];
        this.drawNoise(colors, 0.05);
        return this.getTextureData();
    }

    drawNoise(colors, variance) {
        for (let x = 0; x < this.resolution; x++) {
            for (let y = 0; y < this.resolution; y++) {
                if (Math.random() < variance) {
                    this.ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
                } else {
                    this.ctx.fillStyle = colors[0];
                }
                this.ctx.fillRect(x, y, 1, 1);
            }
        }
    }

    getTextureData() {
        return this.canvas.toDataURL('image/png');
    }
}

export default TextureGenerator;
