export const BlockTypes = {
    AIR: {
        id: 0,
        name: 'Air',
        transparent: true,
        solid: false
    },
    DIRT: {
        id: 1,
        name: 'Dirt',
        texture: 'dirt',
        solid: true
    },
    STONE: {
        id: 2,
        name: 'Stone',
        texture: 'stone',
        solid: true
    },
    GLASS: {
        id: 3,
        name: 'Glass',
        texture: 'glass',
        transparent: true,
        solid: true
    }
};

export function getBlockType(id) {
    return Object.values(BlockTypes).find(type => type.id === id) || BlockTypes.AIR;
}
