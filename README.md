# VR Exploration Game Development Plan

## Overview
VR/AR/XR experience built using A-Frame and Taichi.js, featuring dynamic voxel chunks and procedural generation.

## Features & Requirements
- **Open World Architecture:**
  - Dynamic chunk generation system
  - Multi-variation chunk support
- **Core Technologies:**
  - A-Frame for VR scene management
  - Three.js for mesh generation
  - Taichi.js for computations

## Development Documentation

### To-Do List

#### Immediate Tasks
- [ ] Test 3D space encoding using RGB channels for terrain data
  - Red channel: X-axis height data
  - Green channel: Y-axis density/type data
  - Blue channel: Z-axis variation data
  - Alpha channel: Additional metadata
- [ ] Implement texture baking system for chunk serialization
- [ ] Fix chunk generation loop
- [ ] Add robust boundary checking
- [ ] Develop loading queue system

#### This Week
- [ ] Create texture atlas for optimized rendering
- [ ] Implement basic LOD system
- [ ] Add debug visualization tools
- [ ] Test RGB encoding performance

#### Next Sprint
- [ ] Optimize chunk meshing
- [ ] Implement greedy meshing
- [ ] Add geometry instancing
- [ ] Create chunk compression system

### Architecture

#### Core Components
```
World
├── Chunks (10x10x10)
│   ├── Blocks (1x1x1)
│   └── Voxels (0.1³)
└── Managers
    ├── ChunkManager
    ├── TextureManager
    └── WorldManager
```

### Implementation Details
- **Save System:**
  - Chunks: RGB-encoded height maps
  - World: Compressed binary data
  - Voxels: Run-length encoding

## Development Phases

### Phase 1 (Current)
- Implement RGB terrain encoding
- Test texture baking performance
- Optimize chunk generation

### Phase 2
- Enhance compression systems
- Implement proper LOD
- Add advanced culling

### Phase 3
- Polish visualization
- Optimize memory usage
- Deploy beta version

## Technical Notes

### RGB Encoding System
```javascript
// Example encoding structure
{
  red: heightData,    // 0-255 for height
  green: withData,    // 0-255 for
  blue: depthData,  // 0-255 for 
  alpha: typeData     // 0-255 for block types
}
```

### Development Setup
- Modern WebVR browser required
- Local HTTP server for module support
- Node.js for build tools

## Logging Improvements

### Overview
Logging has been improved across all parts of the game to provide detailed insights into the game's flow and operations. This includes extensive explanations for each logging statement and a flag to enable or disable logging.

### Logging Flag
A logging flag has been added to enable or disable logging. This flag can be found in the script section of `index.html` and in the `init` functions of various components.

### Enabling/Disabling Logging
To enable logging, set the `loggingEnabled` flag to `true`. To disable logging, set the flag to `false`.

### Examples of Logging Output
- Initialization of the A-Frame scene: `console.log('A-Frame scene loaded')`
- Loading of the world container: `console.log('World container status:', { childCount: container.children.length, children: Array.from(container.children).map(c => c.getAttribute('chunk')) })`
- Player rig setup: `console.log('Player rig setup complete')`

### Purpose of Logging
The purpose of logging is to provide developers with detailed insights into the game's flow and operations. This helps in debugging and understanding the game's behavior, making it easier to identify and fix issues.

## Inventory Ideas

### Overview
The inventory system will allow players to collect, store, and manage various items within the game. This includes resources, tools, and other objects that can be used for crafting, building, and exploration.

### Features
- **Item Collection:**
  - Players can collect items by interacting with the environment.
  - Items can be picked up, dropped, and transferred between inventory slots.
- **Inventory Slots:**
  - The inventory will have a limited number of slots for storing items.
  - Each slot can hold a specific type and quantity of item.
- **Crafting System:**
  - Players can combine items to create new tools, structures, and resources.
  - Crafting recipes will be available for players to discover and use.
- **Resource Management:**
  - Players must manage their resources effectively to survive and progress in the game.
  - Resources can be gathered from the environment and used for crafting and building.

### Implementation Details
- **UI Design:**
  - The inventory UI will be accessible through a menu or hotkey.
  - Items will be displayed in a grid layout with icons and descriptions.
- **Item Types:**
  - Common items: wood, stone, metal, food, etc.
  - Tools: pickaxe, axe, shovel, etc.
  - Special items: rare resources, unique tools, etc.
- **Interaction:**
  - Players can interact with the inventory using VR controllers or keyboard/mouse.
  - Drag-and-drop functionality for moving items between slots.
- **Persistence:**
  - Inventory data will be saved and loaded with the player's progress.
  - Items will be retained between game sessions.

### Future Enhancements
- **Advanced Crafting:**
  - More complex crafting recipes and item combinations.
  - Integration with the world generation system for unique resources.
- **Inventory Expansion:**
  - Additional inventory slots and storage options.
  - Backpacks, chests, and other storage containers.
- **Multiplayer Support:**
  - Shared inventory and trading between players.
  - Cooperative crafting and resource management.

## Known Issues & Troubleshooting

### Loading Screen Issues
The game may occasionally get stuck at the loading screen. This is typically caused by:
1. React JSX syntax errors in UI components
2. Race conditions during manager initialization
3. Missing passive event listeners in touch controls

#### Error Signatures
```
Uncaught SyntaxError: Unexpected token '<' (at ui.js:34:9)
[Violation] Added non-passive event listener to a scroll-blocking 'touchmove' event
Game initialization timeout - continuing without game instance
```

### Troubleshooting Steps

1. **Loading Screen Stuck**
   ```javascript
   // Check browser console for these specific errors:
   - SyntaxError: Unexpected token '<' 
   - [LoadingScreen] Component initialized
   - Game initialization timeout
   ```
   Solution: Ensure React is properly loaded before any JSX rendering

2. **Touch Event Warnings**
   ```javascript
   // Update touch event listeners with passive flag
   element.addEventListener('touchstart', handler, { passive: true });
   element.addEventListener('touchmove', handler, { passive: true });
   ```

3. **Game Instance Not Found**
   ```javascript
   // Add timeout and retry logic to game initialization
   await new Promise((resolve, reject) => {
     const checkGame = () => {
       if (window.game) resolve();
       else if (retries++ < maxRetries) setTimeout(checkGame, 100);
       else reject(new Error('Game initialization timeout'));
     };
     checkGame();
   });
   ```

### Initialization Sequence
```
1. A-Frame Scene Load
2. Player Controls Init
3. VR Controls Setup
4. Keyboard Controls Setup
5. LoadingScreen Manager
6. Game Instance Init
```

### Version Compatibility
```
A-Frame: 1.4.0 (2022-12-26)
THREE.js: ^0.147.0
WebVR Polyfill: ^0.10.12
```

## File Limit Notice

Due to project constraints, please do not exceed a 10–file limit when adding new source files.
Note: The index.html and README.md files also count toward this 10–file limit. no additional files alowed to create.

## For AI Models

### Project Context
This section is specifically for AI models participating in development:

- **Human Collaborator:** Justinas Gibas
  - Role: Project administrator, tester, and feedback provider
  - Responsibilities: Code review, testing, and validation

- **AI Model Responsibilities:**
  - Maintain documentation
  - Generate code suggestions
  - Update technical specifications
  - Follow established patterns
  - Respect file limits

### Communication Protocol
- Use this README as primary documentation
- Document all major decisions
- Maintain clear development phases
- Update technical notes as needed

### Project Constraints
- Maximum 10 files total (including index.html and README.md)
- Current files (10/10):
  1. index.html
  2. README.md
  3. config.js
  4. game.js
  5. components.js
  6. managers.js
  7. ui.js
  8. styles.css
  9. player.js
  10. generators.js

### File Dependencies
```
index.html
├── config.js
├── generators.js
├── managers.js
├── components.js
├── player.js
├── game.js
├── ui.js
└── styles.css
```

### Code Organization Rules
1. New features must be added to existing files
2. Use namespacing to organize code within files
3. Follow the established patterns for each file:
   - config.js: Constants and configuration
   - generators.js: World generation logic
   - managers.js: Game state management
   - components.js: A-Frame components
   - player.js: Player-related logic
   - game.js: Core game initialization
   - ui.js: UI components and management
   - styles.css: All styling

### Common Integration Points
1. StateManager (managers.js) for state changes
2. UIManager (ui.js) for UI updates
3. EventSystem through A-Frame's event system
4. CONFIG object (config.js) for settings

### Pattern Examples
```javascript
// Adding new feature to existing file
// In components.js:
AFRAME.registerComponent('new-feature', {
    schema: {
        // Properties
    },
    init() {
        // Initialization
    }
});
```

```javascript
// In managers.js:
class ExistingManager {
    newFeatureMethod() {
        // New functionality
    }
}
```

### When Suggesting Changes
1. Always specify the target file
2. Use existing patterns within that file
3. Maintain current dependency structure
4. Consider the 10-file limit

JG promts
improve, develop or fix one small thing prepering for the next one.