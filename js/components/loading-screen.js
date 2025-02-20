AFRAME.registerComponent('loading-screen', {
    init: function() {
        this.loadingScreen = document.querySelector('#loading-screen');
        this.scene = this.el;
        
        this.scene.addEventListener('loaded', () => {
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
            }, 1000);
        });
    }
});
