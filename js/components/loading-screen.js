AFRAME.registerComponent('loading-screen', {
    init: function() {
        this.loadingScreen = document.querySelector('#loading-screen');
        this.loadingText = this.loadingScreen.querySelector('.loader');
        this.setupLoadingManager();
    },

    setupLoadingManager: function() {
        THREE.DefaultLoadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            const progress = (itemsLoaded / itemsTotal * 100).toFixed(0);
            this.loadingText.textContent = `Loading textures... ${progress}%`;
        };

        THREE.DefaultLoadingManager.onLoad = () => {
            setTimeout(() => {
                this.loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    this.loadingScreen.style.display = 'none';
                }, 500);
            }, 1000);
        };
    }
});
