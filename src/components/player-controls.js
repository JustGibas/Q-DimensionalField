AFRAME.registerComponent('player-controls', {
    init: function() {
        // Logging flag to enable/disable logging
        const loggingEnabled = true;

        if (loggingEnabled) console.log('Initializing player controls component');
        this.setupVRControls();
        this.setupKeyboardControls();

        // Update chunks around the player
        this.updateChunksAroundPlayer();
    },

    setupVRControls: function() {
        // Log the setup of VR controls
        if (loggingEnabled) console.log('Setting up VR controls');

        const rightHand = document.querySelector('[oculus-touch-controls="hand: right"]');
        if (rightHand) {
            rightHand.addEventListener('triggerdown', () => {
                if (loggingEnabled) console.log('Right hand trigger pressed');
                this.attemptChunkInteraction();
            });
        }
    },

    setupKeyboardControls: function() {
        // Log the setup of keyboard controls
        if (loggingEnabled) console.log('Setting up keyboard controls');

        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                if (loggingEnabled) console.log('Space key pressed');
                this.attemptChunkInteraction();
            }
        });
    },

    attemptChunkInteraction: function() {
        // Log the attempt to interact with a chunk
        if (loggingEnabled) console.log('Attempting chunk interaction');

        const cursor = document.querySelector('[raycaster]');
        if (cursor && cursor.components.raycaster.intersectedEls.length > 0) {
            const intersectedEl = cursor.components.raycaster.intersectedEls[0];
            if (loggingEnabled) console.log('Intersected element:', intersectedEl);
            intersectedEl.emit('click');
        }
    },

    updateChunksAroundPlayer: function() {
        const playerRig = document.querySelector('#player-rig');
        if (playerRig) {
            const playerPosition = playerRig.getAttribute('position');
            chunkManager.updateChunksAroundPlayer(playerPosition);

            // Update the debug box with the player's current coordinate position
            const playerPositionElement = document.getElementById('player-position');
            if (playerPositionElement) {
                playerPositionElement.textContent = `${playerPosition.x.toFixed(2)}, ${playerPosition.y.toFixed(2)}, ${playerPosition.z.toFixed(2)}`;
            }
        }
    }
});
