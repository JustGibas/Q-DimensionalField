This README.md is used as main development document.

Project Overview
This project is built using an autonomous development system that combines the power of GitHub Copilot for AI-assisted coding with the automation capabilities of Actiona. The system works as follows:

GitHub Copilot Integration:
Copilot is used to generate code, offer suggestions, and help structure the project. It serves as the primary code assistant throughout development.

Actiona Automation:
Actiona manages tasks on the PC, including running tests, fetching console outputs, and automatically entering prompts. This automation layer simulates a human developer by performing routine checks and operations.

Iterative Development Cycle:
The project starts from a clean slate for each new iteration. While old files are preserved as references for historical context, every development cycle begins with a fresh, autonomous run. This approach ensures that improvements are incremental and clearly documented.

The content in this README reflects the initial iteration of the autonomous development process. As the system evolves, subsequent iterations will update this documentation to capture changes, refinements, and new features.

Continue to next iteration if no erros present from last iteration goals. if errors persits document and make resoning tasks. doing sord of iner monolog in readme.md file. 

deevelopig is done with Major.Minor.Iteration Logic 

Stack:
A-Frame 1.7.0:
https://aframe.io/releases/1.7.0/aframe.min.js

aframe-drag-component (for 3D dragging):
https://unpkg.com/aframe-drag-component@latest/dist/aframe-drag-component.min.js

aframe-look-at-component (for orienting objects toward targets):
https://unpkg.com/aframe-look-at-component@latest/dist/aframe-look-at-component.min.js

aframe-physics-system 4.0.1:
https://unpkg.com/aframe-physics-system@4.0.1/dist/aframe-physics-system.min.js

networked-aframe 0.8.0:
https://unpkg.com/networked-aframe@0.8.0/dist/networked-aframe.min.js

Shoelace 2.20.0 (for 2D UI overlays):
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.0/cdn/themes/light.css" />
<script type="module" src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.0/cdn/shoelace-autoloader.js"></script>

aframe-gui 1.0.0 (for immersive, in‑scene UI):
https://unpkg.com/aframe-gui@1.0.0/dist/aframe-gui.min.js

GSAP 3.11.0 (for advanced animations):
https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.0/gsap.min.js

Howler.js 2.2.3 (for audio):
https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js

aframe-extras 6.1.1 (additional A‑Frame helpers):
https://unpkg.com/aframe-extras@6.1.1/dist/aframe-extras.min.js

State Management – Nanostores 0.8.0:
https://unpkg.com/nanostores@0.8.0/dist/nanostores.umd.js

Stats.js 17 (performance monitoring):
https://cdnjs.cloudflare.com/ajax/libs/stats.js/r17/Stats.min.js

GPU Compute – Taichi.js (experimental):
https://github.com/AmesingFlank/taichi.js

GPU Compute – GPU.js (alternative):
https://unpkg.com/gpu.js@latest/dist/gpu-browser.min.js

World Generation – aframe-environment-component 1.3.2:
https://unpkg.com/aframe-environment-component@1.3.2/dist/aframe-environment-component.min.js

Inventory System – aframe-inventory-component:
https://unpkg.com/aframe-inventory-component@latest/dist/aframe-inventory-component.min.js

aframe-haptics-component
URL: https://github.com/supermedium/superframe/tree/master/components/haptics

aframe-particle-system-component (For special effects)
URL: https://github.com/IdeaSpaceVR/aframe-particle-system-component
Why: Add particle effects like fire, smoke, explosions, and magic spells.

Postprocessing for A-Frame
URL: https://github.com/supermedium/superframe/tree/master/components/postprocessing

Math Library – gl-matrix (for vector/matrix math):
https://cdnjs.cloudflare.com/ajax/libs/gl-matrix/3.4.3/gl-matrix-min.js

Interact.js (for 2D draggable UI on mobile and desktop):
https://cdn.jsdelivr.net/npm/interactjs/dist/interact.min.js

Simplex Noise
URL: https://github.com/jwagner/simplex-noise.js
Why: Create procedural terrains, skyboxes, and other generative content.

OpenAI API / GPT Integration
URL: https://platform.openai.com
Why: Implement AI-driven NPC dialogues, storytelling, and dynamic content generation.

Troika-3D Text
URL: https://github.com/protectwise/troika/tree/master/packages/troika-3d-text
Why: High-quality 3D text rendering with SDF (Signed Distance Fields) for crisp text in XR.


For debugging in A-Frame, you can also use the built‑in A-Frame Inspector (press Ctrl+Alt+I) to analyze your scene on both desktop and mobile devices.

## Development Status
Current Version: 0.0.0 (Active Development)

PLan: every second iteration is for valditaing and planing.

0.0.0 dodumentation and next step planing 
0.0.1 documentation and aframe 0.1.7 import with three THREE r173 (@dmarcos) and other libs next step planing
0.0.2 documentaion valdiation of all libs import sucsess and next step planing
0.0.3 documentation and adding simple logginng to track code while game or website is runing. next step planing
0.0.4 documentation and valditating logs in console logs next step planing
0.0.5 documentation and aframe init with wasd controlls and simple ground.next step planing
0.0.6 documentaion valdiation and next step planing 
0.0.7 documentation and adding improving ui (state and components)next step planing
0.0.8 documentation and etc...
0.0.9
0.0.10
0.0.11
0.1.0 after all sucsesfull conformation.
