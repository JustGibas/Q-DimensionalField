AFRAME.registerComponent('voxel-chunk', {
    schema: {
        position: { type: 'vec3' },
        size: { type: 'number', default: 1 },
        type: { type: 'string', default: 'default' }
    },

    init: function() {
        this.createChunk();
        this.addEventListeners();
    },

    createChunk: function() {
        const material = new THREE.MeshStandardMaterial({
            color: this.getColorForType(),
            roughness: 0.7,
            metalness: 0.2
        });
        
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
            water: '#5555ff'
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
