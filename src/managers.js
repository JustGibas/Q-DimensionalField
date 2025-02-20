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
            this.CHUNK_SIZE = CONFIG.SIZES.CHUNK;
            this.BLOCK_SIZE = CONFIG.SIZES.BLOCK;
            this.container = document.querySelector('#world-container');
            if (!this.container) {
                console.error('Could not find world-container element!');
                return;
            }
            this.renderDistance = 2; // Number of chunks to render in each direction
            this.lastPlayerChunkPos = { x: 0, z: 0 };
            this.spawnInitialChunk();
            this.initializePlane();
            
            if (CONFIG.DEBUG_OPTIONS.LOG_CHUNK_CREATION) {
                Logger.info('ChunkManager', 'Initialized with debug options', CONFIG.DEBUG_OPTIONS);
            }

            Logger.performance('ChunkManager', 'initialization', startTime);
        } catch (error) {
            Logger.error('ChunkManager', CONFIG.ERROR_CODES.WORLD_INIT, error);
        }
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
        const startTime = performance.now();
        Logger.logStep('ChunkManager', 'Updating chunks around player', { playerPosition });

        const chunkPos = this.getChunkPosition(playerPosition);
        Logger.logStep('ChunkManager', 'Calculated chunk position', { chunkPos });
        
        if (chunkPos.x !== this.lastPlayerChunkPos.x || 
            chunkPos.z !== this.lastPlayerChunkPos.z) {
            
            Logger.logStep('ChunkManager', 'Player moved to new chunk', {
                from: this.lastPlayerChunkPos,
                to: chunkPos
            });
            
            this.loadNewChunks(chunkPos);
            this.unloadDistantChunks(chunkPos);
            
            this.lastPlayerChunkPos = { ...chunkPos };
        }

        Logger.logPerformance('ChunkManager', 'updateChunksAroundPlayer', 
            performance.now() - startTime);
    }

    loadNewChunks(centerChunkPos) {
        for (let x = -this.renderDistance; x <= this.renderDistance; x++) {
            for (let z = -this.renderDistance; z <= this.renderDistance; z++) {
                const pos = {
                    x: centerChunkPos.x + x,
                    y: 0,
                    z: centerChunkPos.z + z
                };
                const key = `${pos.x},${pos.y},${pos.z}`;
                
                if (!this.chunks.has(key)) {
                    this.createChunk(pos);
                }
            }
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

            Logger.logStep('ChunkManager', 'Setting chunk position', {
                worldX: position.x * this.CHUNK_SIZE * 16,
                worldY: position.y * this.CHUNK_SIZE * 16,
                worldZ: position.z * this.CHUNK_SIZE * 16
            });

            chunk.setAttribute('position', `${
                position.x * this.CHUNK_SIZE * 16
            } ${
                position.y * this.CHUNK_SIZE * 16
            } ${
                position.z * this.CHUNK_SIZE * 16
            }`);

            this.chunks.set(key, chunk);
            this.container.appendChild(chunk);

            Logger.logStep('ChunkManager', 'Chunk created', { 
                key,
                totalChunks: this.chunks.size 
            });
            
            Logger.performance('ChunkManager', 'chunk_creation', startTime);
            Logger.memory('ChunkManager');

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

        this.initializeUI();
        this.setupEventListeners();
        this.startPerformanceMonitoring();
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

    toggleWindow(windowId, force) {
        const window = this.windows.get(windowId);
        if (window) {
            const newState = force !== undefined ? force : !window.visible;
            window.visible = newState;
            window.element.classList.toggle('visible', newState);
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

    updateDebugInfo(data) {
        if (!this.DEBUG) return;
        
        const debugContent = document.getElementById('debug-content');
        for (const [key, value] of Object.entries(data)) {
            const element = debugContent.querySelector(`#debug-${key}`);
            if (element) {
                element.textContent = value;
            }
        }
    }
}

export { ChunkManager, VoxelManager, WorldManager, UIManager, TaichiManager };
