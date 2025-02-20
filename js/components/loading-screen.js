AFRAME.registerComponent('loading-screen', {
    init: function() {
        // Logging flag to enable/disable logging
        const loggingEnabled = true;

        if (loggingEnabled) console.log('Initializing loading screen component');
        this.loadingScreen = document.querySelector('#loading-screen');
        this.loadingText = this.loadingScreen.querySelector('.loader');
        this.setupLoadingManager();
    },

    setupLoadingManager: function() {
        // Log the setup of the loading manager
        if (loggingEnabled) console.log('Setting up loading manager');

        THREE.DefaultLoadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            const progress = (itemsLoaded / itemsTotal * 100).toFixed(0);
            this.loadingText.textContent = `Loading textures... ${progress}%`;

            // Log the loading progress
            if (loggingEnabled) console.log(`Loading progress: ${progress}%`);
        };

        THREE.DefaultLoadingManager.onLoad = () => {
            // Log the completion of loading
            if (loggingEnabled) console.log('Loading complete');

            setTimeout(() => {
                this.loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    this.loadingScreen.style.display = 'none';
                }, 500);
            }, 1000);
        };
    }
});
