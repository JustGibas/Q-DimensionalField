import * as THREE from 'three';
import { TextureManager, TextureGenerator, chunkGenerator } from './generators.js';
import { CONFIG, Logger } from './config.js';

class ChunkManager {
    constructor() {
        if (!CONFIG.FLAGS.ENABLE_CHUNK_GENERATION) {
            Logger.info('ChunkManager', 'Chunk management disabled by flag');
            return;
        }

        const startTime = performance.now();
        Logger.info('ChunkManager', 'Initializing', { version: CONFIG.VERSIONS.CHUNK_MANAGER });
        
        try {
            this.chunks = new Map();
            this.chunksToLoad = [];
            this.chunkCount = 0;
            this.CHUNK_SIZE = CONFIG.WORLD.CHUNK_SIZE;
            this.EXTENT = CONFIG.WORLD.EXTENT;
            this.LOD = CONFIG.WORLD.LOD;
            this.container = document.querySelector('#world-container');
            if (!this.container) {
                console.error('Could not find world-container element!');
                return;
            }
            this.renderDistance = 2; // Number of chunks to render in each direction
            this.lastPlayerChunkPos = null;
            this.spawnInitialChunk();
            this.initializePlane();
            
            if (CONFIG.DEBUG_OPTIONS.LOG_CHUNK_CREATION) {
                Logger.info('ChunkManager', 'Initialized with debug options', CONFIG.DEBUG_OPTIONS);
            }

            Logger.performance('ChunkManager', 'initialization', startTime);
        } catch (error) {
            Logger.error('ChunkManager', CONFIG.ERROR_CODES.WORLD_INIT, error);
        }

        this.lastPlayerPos = { x: 0, y: 0, z: 0 };
        this.currentChunkPos = { x: 0, y: 0, z: 0 };
        this.lastUpdateTime = 0;
    }

    spawnInitialChunk() {
        const chunkData = chunkGenerator.generateChunkData({ x: 0, y: 0, z: 0 });
        const chunk = document.createElement('a-entity');
        chunk.setAttribute('chunk', {
            position: { x: 0, y: 0, z: 0 },
            size: this.CHUNK_SIZE,
            chunkData: chunkData
        });
        chunk.setAttribute('position', '0 0 0');
        chunk.setAttribute('visible', true);
        
        this.container.appendChild(chunk);
        this.chunks.set('0,0,0', chunk);

        this.spawnNeighboringChunks({ x: 0, y: 0, z: 0 });
    }

    spawnNeighboringChunks(centerChunkPos) {
        const neighbors = [
            { x: centerChunkPos.x + 1, y: centerChunkPos.y, z: centerChunkPos.z },
            { x: centerChunkPos.x - 1, y: centerChunkPos.y, z: centerChunkPos.z },
            { x: centerChunkPos.x, y: centerChunkPos.y, z: centerChunkPos.z + 1 },
            { x: centerChunkPos.x, y: centerChunkPos.y, z: centerChunkPos.z - 1 }
        ];

        for (const pos of neighbors) {
            const key = `${pos.x},${pos.y},${pos.z}`;
            if (!this.chunks.has(key)) {
                this.createChunk(pos);
            }
        }
    }

    initializePlane() {
        for (let x = -this.renderDistance; x <= this.renderDistance; x++) {
            for (let z = -this.renderDistance; z <= this.renderDistance; z++) {
                this.createChunk({ x, y: 0, z });
            }
        }
    }

    updateChunksAroundPlayer(playerPosition) {
        const chunkPos = this.calculateChunkPosition(playerPosition);
        
        // Only update if player moved to new chunk
        if (this.lastPlayerChunkPos && 
            chunkPos.x === this.lastPlayerChunkPos.x && 
            chunkPos.z === this.lastPlayerChunkPos.z) {
            return;
        }

        this.loadChunksAroundPosition(chunkPos);
        this.unloadDistantChunks(chunkPos);
        this.updateChunkLODs(chunkPos);
        
        this.lastPlayerChunkPos = chunkPos;
    }

    hasChangedChunks(newChunkPos) {
        return this.currentChunkPos.x !== newChunkPos.x ||
               this.currentChunkPos.y !== newChunkPos.y ||
               this.currentChunkPos.z !== newChunkPos.z;
    }

    loadNewChunks(centerChunkPos) {
        const chunksToLoad = new Set();
        const renderDist = CONFIG.SIZES.RENDER_DISTANCE;

        // Calculate needed chunks
        for (let x = -renderDist; x <= renderDist; x++) {
            for (let z = -renderDist; z <= renderDist; z++) {
                const pos = {
                    x: centerChunkPos.x + x,
                    y: centerChunkPos.y,
                    z: centerChunkPos.z + z
                };
                const key = `${pos.x},${pos.y},${pos.z}`;
                chunksToLoad.add(key);
            }
        }

        // Remove already loaded chunks from the set
        for (const [key, _] of this.chunks) {
            chunksToLoad.delete(key);
        }

        // Load new chunks
        for (const key of chunksToLoad) {
            const [x, y, z] = key.split(',').map(Number);
            this.createChunk({ x, y, z });
        }
    }

    unloadDistantChunks(centerChunkPos) {
        for (const [key, chunk] of this.chunks) {
            const [x, y, z] = key.split(',').map(Number);
            const distance = Math.max(
                Math.abs(x - centerChunkPos.x),
                Math.abs(z - centerChunkPos.z)
            );
            
            if (distance > 3) {
                this.container.removeChild(chunk);
                this.chunks.delete(key);
            }
        }
    }

    createChunk(position) {
        if (this.chunkCount >= CONFIG.DEBUG_OPTIONS.MAX_CHUNKS) {
            Logger.warn('ChunkManager', 'Max chunk limit reached');
            return null;
        }

        // Add delay if specified
        if (CONFIG.DEBUG_OPTIONS.CHUNK_CREATION_DELAY > 0) {
            setTimeout(() => {
                this._createChunkInternal(position);
            }, CONFIG.DEBUG_OPTIONS.CHUNK_CREATION_DELAY);
            return null;
        }

        return this._createChunkInternal(position);
    }

    _createChunkInternal(position) {
        const startTime = performance.now();
        try {
            Logger.logStep('ChunkManager', 'Creating new chunk', { position });

            const chunkData = chunkGenerator.generateChunkData(position);
            Logger.logStep('ChunkManager', 'Generated chunk data', { 
                dataSize: chunkData.length,
                position 
            });

            const chunk = document.createElement('a-entity');
            const key = `${position.x},${position.y},${position.z}`;

            chunk.setAttribute('chunk', {
                position: position,
                size: this.CHUNK_SIZE,
                chunkData: chunkData
            });

            // FIX: Remove extra multiplier; use CHUNK_SIZE directly.
            chunk.setAttribute('position', `${position.x * this.CHUNK_SIZE} ${position.y * this.CHUNK_SIZE} ${position.z * this.CHUNK_SIZE}`);

            this.chunks.set(key, chunk);
            this.container.appendChild(chunk);

            Logger.logStep('ChunkManager', 'Chunk created', { 
                key,
                totalChunks: this.chunks.size 
            });
            
            Logger.performance('ChunkManager', 'chunk_creation', startTime);
            Logger.memory('ChunkManager');

            // Update debug info with new chunk count and player's current chunk
            if(window.uiManager) {
                window.uiManager.updateDebugInfo({
                    'chunk-count': this.chunks.size,
                    'player-chunk': `${position.x}, ${position.z}`
                });
            }

            return chunk;
        } catch (error) {
            Logger.error('ChunkManager', 'Failed to create chunk', error);
            return null;
        }
    }

    getOrCreateChunk(worldPosition) {
        const chunkPos = this.getChunkPosition(worldPosition);
        const key = `${chunkPos.x},${chunkPos.y},${chunkPos.z}`;
        
        if (!this.chunks.has(key)) {
            return this.createChunk(chunkPos);
        }
        return this.chunks.get(key);
    }

    getChunkPosition(worldPos) {
        return {
            x: Math.floor(worldPos.x / (this.CHUNK_SIZE * this.BLOCK_SIZE)),
            y: Math.floor(worldPos.y / (this.CHUNK_SIZE * this.BLOCK_SIZE)),
            z: Math.floor(worldPos.z / (this.CHUNK_SIZE * this.BLOCK_SIZE))
        };
    }

    calculateChunkPosition(worldPosition) {
        return {
            x: Math.floor(worldPosition.x / this.CHUNK_SIZE),
            y: Math.floor(worldPosition.y / this.CHUNK_SIZE),
            z: Math.floor(worldPosition.z / this.CHUNK_SIZE)
        };
    }

    getLODLevel(distance) {
        if (distance <= this.LOD.FULL.DISTANCE) return this.LOD.FULL;
        if (distance <= this.LOD.MEDIUM.DISTANCE) return this.LOD.MEDIUM;
        return this.LOD.FAR;
    }

    loadChunksAroundPosition(centerPos) {
        const maxDist = CONFIG.WORLD.LOD.FAR.DISTANCE;
        
        for (let x = -maxDist; x <= maxDist; x++) {
            for (let z = -maxDist; z <= maxDist; z++) {
                const pos = {
                    x: centerPos.x + x,
                    y: centerPos.y,
                    z: centerPos.z + z
                };
                
                const distance = Math.max(Math.abs(x), Math.abs(z));
                const lod = this.getLODLevel(distance);
                
                this.createOrUpdateChunk(pos, lod);
            }
        }
    }

    createOrUpdateChunk(position, lod) {
        const key = `${position.x},${position.y},${position.z}`;
        
        if (!this.chunks.has(key)) {
            const chunk = this.createChunk(position, lod);
            this.chunks.set(key, chunk);
        } else {
            const chunk = this.chunks.get(key);
            this.updateChunkLOD(chunk, lod);
        }
    }

    updateChunkLOD(chunk, lod) {
        if (!chunk || !lod) return;

        try {
            // Get current chunk attributes
            const currentAttrs = chunk.getAttribute('chunk');
            if (!currentAttrs) return;

            // Update chunk attributes with new LOD settings
            chunk.setAttribute('chunk', {
                ...currentAttrs,
                lodLevel: lod.RESOLUTION,
                quality: this.getLODQualitySettings(lod)
            });

            Logger.debug('ChunkManager', 'Updated chunk LOD', {
                chunkId: chunk.id,
                newLOD: lod.RESOLUTION
            });

        } catch (error) {
            Logger.error('ChunkManager', 'Failed to update chunk LOD', error);
        }
    }

    updateChunkLODs(centerPos) {
        for (const [key, chunk] of this.chunks) {
            const [x, y, z] = key.split(',').map(Number);
            const distance = Math.max(
                Math.abs(x - centerPos.x),
                Math.abs(z - centerPos.z)
            );
            
            const lod = this.getLODLevel(distance);
            this.updateChunkLOD(chunk, lod);
        }
    }

    getLODQualitySettings(lod) {
        // Placeholder LOD quality settings
        return {
            geometryDetail: lod.RESOLUTION,
            textureQuality: lod.RESOLUTION === 1 ? 'high' : 
                           lod.RESOLUTION === 2 ? 'medium' : 'low',
            shadowQuality: lod.RESOLUTION === 1 ? 'high' : 'low',
            skipGeometry: lod.RESOLUTION > 4  // Skip geometry for very far chunks
        };
    }
}

class VoxelManager {
    constructor() {
        Logger.info('VoxelManager', `Initializing version ${CONFIG.VERSIONS.VOXEL_MANAGER}`);
        this.voxelSize = CONFIG.SIZES.VOXEL;
        this.blocksPerVoxel = CONFIG.SIZES.BLOCK / CONFIG.SIZES.VOXEL;
        this.voxels = new Map();
    }

    createVoxel(localPosition, type = 'solid') {
        const voxel = document.createElement('a-entity');
        voxel.setAttribute('voxel', {
            size: this.voxelSize,
            type: type
        });
        voxel.setAttribute('position', `${
            localPosition.x * this.voxelSize
        } ${
            localPosition.y * this.voxelSize
        } ${
            localPosition.z * this.voxelSize
        }`);
        
        const key = `${localPosition.x},${localPosition.y},${localPosition.z}`;
        this.voxels.set(key, voxel);
        return voxel;
    }

    removeVoxel(position) {
        const key = `${position.x},${position.y},${position.z}`;
        const voxel = this.voxels.get(key);
        if (voxel) {
            voxel.parentNode.removeChild(voxel);
            this.voxels.delete(key);
        }
    }
}

class WorldManager {
    constructor() {
        Logger.info('WorldManager', `Initializing version ${CONFIG.VERSIONS.WORLD_MANAGER}`);
        this.chunkManager = new ChunkManager();
    }

    // Add manager methods here
}

class TaichiManager {
    constructor() {
        Logger.info('TaichiManager', 'Initializing');
        this.initialized = false;
    }

    async initialize() {
        try {
            // TODO: Initialize Taichi.js when available
            this.initialized = true;
            Logger.info('TaichiManager', 'Initialized successfully');
        } catch (error) {
            Logger.error('TaichiManager', 'Failed to initialize', error);
        }
    }

    async generateChunkDataParallel(position, size) {
        /* TODO: Implement in Taichi
        return ti.kernel(function(pos, size) {
            for(i, j, k in ti.ndrange(size, size, size)) {
                // Generate voxel data in parallel
                let noise = this.computeNoise(pos[0] + i, pos[1] + j, pos[2] + k)
                // Store in 3D grid
            }
        })(position, size)
        */
    }

    async optimizeMesh(vertices, indices) {
        /* TODO: Implement in Taichi
        return ti.kernel(function(verts, idx) {
            // Parallel mesh optimization
            // - Remove hidden faces
            // - Merge vertices
            // - Generate LODs
        })(vertices, indices)
        */
    }

    async simulateParticles(particles, deltaTime) {
        /* TODO: Implement in Taichi
        return ti.kernel(function(p, dt) {
            // Parallel particle updates
            // - Apply forces
            // Handle collisions
            // - Update positions
        })(particles, deltaTime)
        */
    }
}

class UIManager {
    constructor() {
        this.DEBUG = CONFIG.DEBUG;
        this.windows = new Map();
        this.metrics = new Map();
        this.lastFrameTime = performance.now();
        this.frameCount = 0;
        this.lastFPS = 60;
        
        // Inventory state
        this.inventoryVisible = false;
        this.debugVisible = false;
        this.activeHotbarSlot = 0;
        this.inventory = new Array(32).fill(null);
        this.hotbar = new Array(8).fill(null);

        this.toolbarButtons = new Map();
        this.initializeUI();
        this.setupEventListeners();
        this.startPerformanceMonitoring();
        this.initializeToolbar();
    }

    initializeUI() {
        // Initialize all UI windows
        ['settings-panel', 'debug-window', 'performance-window'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                this.windows.set(id, {
                    element,
                    visible: false
                });
            }
        });

        // Initialize toggle states
        this.setToggleState('toggle-debug-window', CONFIG.DEBUG);
        this.setToggleState('toggle-wireframe', CONFIG.FLAGS.WIREFRAME_MODE);
        this.setToggleState('toggle-chunk-bounds', CONFIG.FLAGS.SHOW_CHUNK_BOUNDS);

        // Generate inventory slots
        this.initializeInventory();
        this.initializeHotbar();
        this.initializeDraggableWindows();
    }

    initializeDraggableWindows() {
        document.querySelectorAll('.draggable').forEach(window => {
            const header = window.querySelector('.window-header');
            if (!header) return;

            let isDragging = false;
            let currentX;
            let currentY;
            let initialX;
            let initialY;
            let xOffset = 0;
            let yOffset = 0;

            header.addEventListener('mousedown', (e) => {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
                if (e.target === header) {
                    isDragging = true;
                }
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
                
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;

                window.style.transform = `translate(${currentX}px, ${currentY}px)`;
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });
        });
    }

    // NEW: Add the missing setToggleState method
    setToggleState(toggleId, state) {
        const toggle = document.getElementById(toggleId);
        if (toggle) {
            toggle.checked = state;
        }
    }

    initializeInventory() {
        const inventoryGrid = document.getElementById('inventory-grid');
        for (let i = 0; i < 32; i++) {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot';
            slot.setAttribute('data-slot', i);
            slot.addEventListener('click', () => this.handleSlotClick(i));
            inventoryGrid.appendChild(slot);
        }
    }

    initializeHotbar() {
        const hotbar = document.getElementById('hotbar');
        // Clear existing slots first
        hotbar.innerHTML = '';
        
        // Create exactly 8 slots
        for (let i = 0; i < 8; i++) {
            const slot = document.createElement('div');
            slot.className = 'hotbar-slot';
            slot.setAttribute('data-slot', i);
            slot.addEventListener('click', () => this.selectHotbarSlot(i));
            hotbar.appendChild(slot);
        }
    }

    setupEventListeners() {
        // Window toggle listeners
        document.getElementById('toggle-debug-window')?.addEventListener('change', (e) => {
            this.toggleWindow('debug-window', e.target.checked);
        });

        document.getElementById('toggle-performance-window')?.addEventListener('change', (e) => {
            this.toggleWindow('performance-window', e.target.checked);
        });

        // Debug flag listeners
        document.getElementById('toggle-wireframe')?.addEventListener('change', (e) => {
            CONFIG.FLAGS.WIREFRAME_MODE = e.target.checked;
            this.refreshWorld();
        });

        document.getElementById('toggle-chunk-bounds')?.addEventListener('change', (e) => {
            CONFIG.FLAGS.SHOW_CHUNK_BOUNDS = e.target.checked;
            this.refreshWorld();
        });

        // Add RS-stats toggle
        document.getElementById('toggle-rs-stats')?.addEventListener('change', (e) => {
            this.toggleRSStats(e.target.checked);
        });

        // Keyboard shortcuts
        window.addEventListener('keydown', (e) => {
            if (e.key === 'F3') {
                this.toggleWindow('debug-window');
            }
            if (e.key === 'F4') {
                this.toggleWindow('performance-window');
            }
            if (e.key === 'F10') {
                this.toggleWindow('settings-panel');
            }
            if (e.key === 'Tab') {
                e.preventDefault();
                this.toggleInventory();
            }
            if (e.key >= '1' && e.key <= '8') {
                this.selectHotbarSlot(parseInt(e.key) - 1);
            }
        });
    }

    toggleRSStats(enabled) {
        CONFIG.FLAGS.ENABLE_RS_STATS = enabled;
        const scene = document.querySelector('a-scene');
        if (scene) {
            scene.setAttribute('stats', enabled ? '' : 'false');
        }
    }

    toggleWindow(windowId, force) {
        const window = this.windows.get(windowId);
        if (window) {
            const newState = force !== undefined ? force : !window.visible;
            window.visible = newState;
            window.element.classList.toggle('visible', newState);
            this.updateToolbarButton(windowId);
        }
    }

    startPerformanceMonitoring() {
        const updateMetrics = () => {
            this.updateFPS();
            this.updateMemory();
            this.updateDrawCalls();
            requestAnimationFrame(updateMetrics);
        };
        requestAnimationFrame(updateMetrics);
    }

    updateFPS() {
        const now = performance.now();
        const delta = now - this.lastFrameTime;
        this.frameCount++;
        if (delta >= 1000) {
            this.lastFPS = (this.frameCount / delta) * 1000;
            this.frameCount = 0;
            this.lastFrameTime = now;
            this.updateMetric('fps', this.lastFPS.toFixed(1));
        }
    }

    updateMemory() {
        if (performance.memory) {
            const usedJSHeapSize = performance.memory.usedJSHeapSize / 1048576; // Convert to MB
            this.updateMetric('memory', usedJSHeapSize.toFixed(2));
        }
    }

    updateDrawCalls() {
        // Assuming you have a way to get the number of draw calls
        const drawCalls = this.getDrawCalls();
        this.updateMetric('drawCalls', drawCalls);
    }

    updateMetric(name, value) {
        this.metrics.set(name, value);
        const element = document.getElementById(`metric-${name}`);
        if (element) {
            element.textContent = value;
        }
    }

    getDrawCalls() {
        // Placeholder for actual draw call count retrieval
        return Math.floor(Math.random() * 100);
    }

    refreshWorld() {
        document.dispatchEvent(new CustomEvent('refreshWorld'));
    }

    toggleInventory() {
        this.inventoryVisible = !this.inventoryVisible;
        document.getElementById('inventory-panel').classList.toggle('visible');
    }

    toggleDebug() {
        this.debugVisible = !this.debugVisible;
        document.getElementById('debug-panel').classList.toggle('visible');
    }

    selectHotbarSlot(index) {
        const slots = document.querySelectorAll('.hotbar-slot');
        slots.forEach(slot => slot.classList.remove('active'));
        slots[index].classList.add('active');
        this.activeHotbarSlot = index;
        this.updateHotbarSelection();
    }

    handleSlotClick(index) {
        // Handle inventory slot interaction
        if (this.inventory[index]) {
            this.moveItemToHotbar(index);
        }
    }

    moveItemToHotbar(fromSlot) {
        const item = this.inventory[fromSlot];
        const hotbarSlot = this.activeHotbarSlot;
        
        // Swap items between inventory and hotbar
        this.hotbar[hotbarSlot] = item;
        this.inventory[fromSlot] = null;
        
        this.updateInventoryDisplay();
        this.updateHotbarDisplay();
    }

    updateInventoryDisplay() {
        const slots = document.querySelectorAll('.inventory-slot');
        this.inventory.forEach((item, i) => {
            if (item) {
                slots[i].style.backgroundColor = item.color || 'rgba(255, 255, 255, 0.1)';
                slots[i].textContent = item.count || '';
            } else {
                slots[i].style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                slots[i].textContent = '';
            }
        });
    }

    updateHotbarDisplay() {
        const slots = document.querySelectorAll('.hotbar-slot');
        this.hotbar.forEach((item, i) => {
            if (item) {
                slots[i].style.backgroundColor = item.color || 'rgba(255, 255, 255, 0.1)';
                slots[i].textContent = item.count || '';
            } else {
                slots[i].style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                slots[i].textContent = '';
            }
        });
    }

    updateHotbarSelection() {
        if (this.DEBUG) {
            console.log(`Selected hotbar slot: ${this.activeHotbarSlot}`);
        }
    }

    addItemToInventory(item) {
        const emptySlot = this.inventory.findIndex(slot => slot === null);
        if (emptySlot !== -1) {
            this.inventory[emptySlot] = item;
            this.updateInventoryDisplay();
            return true;
        }
        return false;
    }

    clearChunks() {
        Logger.info('UIManager', 'Clearing all chunks');
        const container = document.querySelector('#world-container');
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        this.updateDebugInfo({
            'chunk-count': '0',
            'total-blocks': '0'
        });
    }

    updateDebugInfo(data) {
        if (!this.DEBUG) return;
        
        // Only update every 100ms
        if (this.lastDebugUpdate && performance.now() - this.lastDebugUpdate < 100) {
            return;
        }
        
        Object.entries(data).forEach(([key, value]) => {
            const element = document.getElementById(key);
            if (element && element.textContent !== value) {
                element.textContent = value;
                element.classList.add('updated');
                setTimeout(() => element.classList.remove('updated'), 300);
            }
        });
        
        this.lastDebugUpdate = performance.now();
    }

    toggleFlag(flagName) {
        if (flagName in CONFIG.FLAGS) {
            CONFIG.FLAGS[flagName] = !CONFIG.FLAGS[flagName];
            Logger.info('UIManager', `Toggle ${flagName}: ${CONFIG.FLAGS[flagName]}`);
            this.refreshWorld();
        }
    }

    setTestMode(mode) {
        CONFIG.DEBUG_OPTIONS.TEST_MODE = mode;
        Logger.info('UIManager', `Set test mode: ${mode}`);
        this.refreshWorld();
    }

    regenerateWorld() {
        Logger.info('UIManager', 'Regenerating world');
        // Clear existing chunks
        const container = document.querySelector('#world-container');
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        
        // Spawn new initial chunk
        const worldManager = new WorldManager();
        worldManager.chunkManager.spawnInitialChunk();
    }

    initializeToolbar() {
        const toolbar = document.querySelector('.window-toolbar');
        if (!toolbar) return;

        // Setup existing buttons
        toolbar.querySelectorAll('.tool-button').forEach(button => {
            const windowId = button.dataset.window;
            if (windowId) {
                this.toolbarButtons.set(windowId, button);
                button.addEventListener('click', () => {
                    this.toggleWindow(windowId);
                    this.updateToolbarButton(windowId);
                });
            }
        });
    }

    addToolbarButton(id, icon, title, onClick) {
        const toolbar = document.querySelector('.window-toolbar');
        if (!toolbar) return;

        const button = document.createElement('button');
        button.className = 'tool-button';
        button.dataset.window = id;
        button.title = title;
        button.innerHTML = `<i class="fas fa-${icon}"></i>${title[0]}`;
        
        if (onClick) {
            button.addEventListener('click', onClick);
        }

        this.toolbarButtons.set(id, button);
        toolbar.appendChild(button);
        
        return button;
    }

    updateToolbarButton(windowId) {
        const button = this.toolbarButtons.get(windowId);
        const window = this.windows.get(windowId);
        
        if (button && window) {
            button.classList.toggle('active', window.visible);
        }
    }
}

export { ChunkManager, VoxelManager, WorldManager, UIManager, TaichiManager };
