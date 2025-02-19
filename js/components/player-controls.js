AFRAME.registerComponent('player-controls', {
    init: function() {
        this.setupVRControls();
        this.setupKeyboardControls();
    },

    setupVRControls: function() {
        const rightHand = document.querySelector('[oculus-touch-controls="hand: right"]');
        if (rightHand) {
            rightHand.addEventListener('triggerdown', () => {
                this.attemptChunkInteraction();
            });
        }
    },

    setupKeyboardControls: function() {
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                this.attemptChunkInteraction();
            }
        });
    },

    attemptChunkInteraction: function() {
        const cursor = document.querySelector('[raycaster]');
        if (cursor && cursor.components.raycaster.intersectedEls.length > 0) {
            const intersectedEl = cursor.components.raycaster.intersectedEls[0];
            intersectedEl.emit('click');
        }
    }
});
