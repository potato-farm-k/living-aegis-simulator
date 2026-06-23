# Decision Log

This document records repository-level decisions for `living-aegis-simulator`.

## 2026-06-23

### Separate the simulator repository from the main game

Decision: Keep production-support simulators in `living-aegis-simulator`, separate
from the main game repository, `living-aegis-origin`.

Reason: Simulators can support scale, camera, timing, and reference exploration
without changing the main game project.

### Separate the simulator repository from gameplay feature experiments

Decision: Keep gameplay feature experiments in `living-aegis-prototype`, separate
from `living-aegis-simulator`.

Reason: Simulator workspaces and gameplay prototypes have different purposes and
should not share naming, structure, or implementation assumptions by default.

### Use the root page as a launcher

Decision: The root `index.html` is a launcher page, not a simulator runtime.

Reason: GitHub Pages should open to a clear list of available simulator
workspaces.

### Keep simulators independent

Decision: Each simulator should live in its own root-level folder and remain
independently openable.

Reason: Future simulators can be added without restructuring existing workspaces.

### Do not use numeric folder prefixes

Decision: Simulator folder names should not use ordering prefixes.

Reason: Descriptive names remain stable when simulators are added, removed, or
reordered.

### Start without build tooling

Decision: Begin with static HTML/CSS/JavaScript files and no package manager,
server code, API code, or database code.

Reason: The current repository can be served by GitHub Pages and kept simple
during the initial scaffold stage.
