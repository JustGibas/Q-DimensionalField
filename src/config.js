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
    LOGGING: {
        enabled: true,
        level: 'debug', // 'debug' | 'info' | 'warn' | 'error'
        component: true,
        manager: true,
        performance: true
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
    }
};
