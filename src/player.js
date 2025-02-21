import { ChunkManager } from './managers.js';

AFRAME.registerComponent('player-controls', {
    init: function() {
        this.loggingEnabled = true;
        if (this.loggingEnabled) console.log('Initializing player controls component');
        this.setupVRControls();
        this.setupKeyboardControls();

        // Initialize chunkManager before calling updateChunksAroundPlayer
        this.chunkManager = new ChunkManager();

        // Update chunks around the player
        this.updateChunksAroundPlayer();
    },

    setupVRControls: function() {
        if (this.loggingEnabled) console.log('Setting up VR controls');

        const rightHand = document.querySelector('[oculus-touch-controls="hand: right"]');
        if (rightHand) {
            rightHand.addEventListener('triggerdown', () => {
                if (this.loggingEnabled) console.log('Right hand trigger pressed');
                this.attemptChunkInteraction();
            });
        }
    },

    setupKeyboardControls: function() {
        if (this.loggingEnabled) console.log('Setting up keyboard controls');

        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                if (this.loggingEnabled) console.log('Space key pressed');
                this.attemptChunkInteraction();
            }
        });
    },

    attemptChunkInteraction: function() {
        if (this.loggingEnabled) console.log('Attempting chunk interaction');

        const cursor = document.querySelector('[raycaster]');
        if (cursor && cursor.components.raycaster.intersectedEls.length > 0) {
            const intersectedEl = cursor.components.raycaster.intersectedEls[0];
            if (this.loggingEnabled) console.log('Intersected element:', intersectedEl);
            intersectedEl.emit('click');
        }
    },

    updateChunksAroundPlayer: function() {
        const playerRig = document.querySelector('#player-rig');
        if (playerRig) {
            const playerPosition = playerRig.getAttribute('position');
            this.chunkManager.updateChunksAroundPlayer(playerPosition);

            // Update debug info with current position
            if (window.uiManager) {
                window.uiManager.updateDebugInfo({
                    'player-position': `${playerPosition.x.toFixed(2)}, ${playerPosition.y.toFixed(2)}, ${playerPosition.z.toFixed(2)}`
                });
            }
        }

        // Keep checking position periodically
        requestAnimationFrame(() => this.updateChunksAroundPlayer());
    }
});
