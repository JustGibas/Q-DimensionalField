import TextureGenerator from '../utils/texture-generator.js';

AFRAME.registerComponent('voxel-chunk', {
    schema: {
        position: { type: 'vec3' },
        size: { type: 'number', default: 1 },
        type: { type: 'string', default: 'default' },
        texture: { type: 'string', default: '' },
        materialType: { type: 'string', default: 'basic' }
    },

    init: function() {
        this.textureGenerator = new TextureGenerator(16);
        this.createChunk();
        this.addEventListeners();
    },

    createChunk: function() {
        const materialProps = {
            color: 0xffffff, // Use white as base color
            roughness: 0.7,
            metalness: 0.2
        };

        // Generate and apply texture
        const textureData = this.textureGenerator.generateTexture(this.data.type);
        const texture = new THREE.TextureLoader().load(textureData);
        texture.magFilter = THREE.NearestFilter; // Ensure pixelated look
        texture.minFilter = THREE.NearestFilter;
        materialProps.map = texture;

        const material = new THREE.MeshStandardMaterial(materialProps);

        const geometry = new THREE.BoxGeometry(this.data.size, this.data.size, this.data.size);
        this.mesh = new THREE.Mesh(geometry, material);
        this.el.setObject3D('mesh', this.mesh);
        this.el.classList.add('clickable');
    },

    getColorForType() {
        const colors = {
            default: '#666666',
            grass: '#55aa55',
            stone: '#777777',
            water: '#5555ff',
            sand: '#f7d794',
            metal: '#95afc0',
            glass: '#dff9fb'
        };
        return colors[this.data.type] || colors.default;
    },

    addEventListeners() {
        this.el.addEventListener('click', () => {
            this.el.emit('chunk-clicked', {
                position: this.el.getAttribute('position'),
                type: this.data.type
            });
        });
    }
});
