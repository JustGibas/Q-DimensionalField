export const CONFIG = {
    DEBUG: true,
    VERSIONS: {
        GAME: '0.1.0',
        CHUNK_MANAGER: '0.1.0',
        WORLD_MANAGER: '0.1.0',
        CHUNK_COMPONENT: '0.1.0',
        INTERACTION_COMPONENT: '0.1.0',
        THREE: '0.149.0',
        AFRAME: '1.4.0'
    },
    FLAGS: {
        ENABLE_BLOCK_GENERATION: false,    // Start with minimal features
        ENABLE_CHUNK_GENERATION: true,     // Keep this enabled
        ENABLE_CHUNK_UPDATES: true,        // Keep this enabled
        ENABLE_TEXTURES: false,
        ENABLE_PHYSICS: false,
        ENABLE_COLLISIONS: false,
        WIREFRAME_MODE: false,
        SHOW_CHUNK_BOUNDS: false,
        SIMPLE_GEOMETRY: true,            // Use simple geometry by default
        ENABLE_RS_STATS: false,
        SCENE_READY: false
    },
    LOADING: {
        TIMEOUT: 10000,                    // 10 second timeout for loading
        MINIMUM_TIME: 1000,                // Minimum loading screen time
        FADE_DURATION: 500                 // Fade out duration in ms
    },
    DEBUG_OPTIONS: {
        LOG_CHUNK_CREATION: true,
        LOG_BLOCK_CREATION: false,
        LOG_PERFORMANCE: true,
        CHUNK_CREATION_DELAY: 0,          // Delay in ms between chunk creation
        MAX_CHUNKS: 50,                   // Maximum number of chunks to generate
        TEST_MODE: 'EMPTY',               // 'EMPTY', 'SINGLE_BLOCK', 'FULL'
    },
    LOGGING: {
        enabled: true,
        level: 'debug', // 'debug' | 'info' | 'warn' | 'error'
        component: true,
        manager: true,
        performance: true,
        updateFrequency: 500, // ms between debug updates
        components: {
            chunk: true,
            player: true,
            world: true
        },
        managers: {
            chunk: true,
            world: true,
            texture: true
        },
        details: {
            showValues: true,
            showTiming: true,
            showMemory: true
        },
        performance: {
            enabled: true,
            threshold: 16.67, // 60fps frame budget
            warnThreshold: 33.33, // 30fps frame budget
            logFrequency: 1000, // 1 second between logs
            positionUpdateThreshold: 0.1 // Minimum position change to log
        },
        memory: {
            trackHeap: true,
            warnThreshold: 0.8 // 80% of available heap
        }
    },
    SIZES: {
        CHUNK: 10,        // 10x10x10 units
        BLOCK: 1,         // 1x1x1 units
        VOXEL: 0.1,      // 0.1x0.1x0.1 units
        RENDER_DISTANCE: 2 // Number of chunks to render in each direction
    },
    ERROR_CODES: {
        CHUNK_GENERATION: 'ERR_CHUNK_GEN',
        TEXTURE_LOADING: 'ERR_TEX_LOAD',
        MESH_CREATION: 'ERR_MESH',
        WORLD_INIT: 'ERR_WORLD_INIT'
    },
    WORLD: {
        CHUNK_SIZE: 10,
        EXTENT: 5, // How far each chunk extends from center
        LOD: {
            FULL: {
                DISTANCE: 2,    // Chunks with full detail
                RESOLUTION: 1   // Full resolution
            },
            MEDIUM: {
                DISTANCE: 4,    // Medium detail chunks
                RESOLUTION: 2   // Half resolution
            },
            FAR: {
                DISTANCE: 8,    // Far chunks
                RESOLUTION: 4   // Quarter resolution
            }
        },
        UNLOAD_DISTANCE: 10    // Distance at which chunks unload
    }
};

export const Logger = {
    debug: (component, message, data = null) => {
        if (!CONFIG.LOGGING.enabled || CONFIG.LOGGING.level !== 'debug') return;
        console.debug(`[${component}]`, message, data || '');
    },
    info: (component, message, data = null) => {
        if (!CONFIG.LOGGING.enabled) return;
        console.info(`[${component}]`, message, data || '');
    },
    warn: (component, message, data = null) => {
        if (!CONFIG.LOGGING.enabled) return;
        console.warn(`[${component}]`, message, data || '');
    },
    error: (component, message, error = null) => {
        if (!CONFIG.LOGGING.enabled) return;
        console.error(`[${component}]`, message, error || '');
    },
    logStep: (component, step, data = null) => {
        if (!CONFIG.LOGGING.enabled) return;
        
        const now = performance.now();
        const lastLog = Logger.lastLogs.get(`${component}-${step}`);
        
        if (lastLog && (now - lastLog) < CONFIG.LOGGING.performance.logFrequency) {
            return;
        }
        
        Logger.lastLogs.set(`${component}-${step}`, now);
        console.log(`[${component}] Step: ${step}`, data ? `Data: ${JSON.stringify(data)}` : '');
    },
    logPerformance: (component, operation, duration) => {
        if (!CONFIG.LOGGING.enabled || !CONFIG.LOGGING.performance) return;
        console.log(`[${component}] Performance - ${operation}: ${duration.toFixed(2)}ms`);
    },
    logMemory: (component, operation) => {
        if (!CONFIG.LOGGING.enabled || !CONFIG.LOGGING.details.showMemory) return;
        const memory = performance.memory;
        console.log(`[${component}] Memory after ${operation}:`, {
            usedHeap: `${(memory.usedJSHeapSize / 1048576).toFixed(2)}MB`,
            totalHeap: `${(memory.totalJSHeapSize / 1048576).toFixed(2)}MB`
        });
    },
    performance: (component, operation, startTime) => {
        const duration = performance.now() - startTime;
        if (duration > CONFIG.LOGGING.performance.warnThreshold) {
            console.warn(`[${component}] Performance warning: ${operation} took ${duration.toFixed(2)}ms`);
        } else if (CONFIG.LOGGING.performance.enabled) {
            console.debug(`[${component}] ${operation}: ${duration.toFixed(2)}ms`);
        }
    },

    memory: (component) => {
        if (!CONFIG.LOGGING.memory.trackHeap) return;
        const memory = performance.memory;
        const usage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
        if (usage > CONFIG.LOGGING.memory.warnThreshold) {
            console.warn(`[${component}] High memory usage: ${(usage * 100).toFixed(1)}%`);
        }
    },
    lastLogs: new Map()
};
