# living-aegis-simulator

Living Aegis Simulator Lab is a collection of small production-support simulators for
Living Aegis Origin.

This repository is not the main game and is not the gameplay feature experiment
workspace.

- Main game: `living-aegis-origin`
- Gameplay feature experiments: `living-aegis-prototype`
- Simulator collection: `living-aegis-simulator`

## Launcher

The root `index.html` is a simulator launcher page. It lists the simulators that
are currently registered in this repository and links to each simulator folder.

Current simulator:

- `earth-moon-travel-simulator/`

## Running Locally

Open the root `index.html` in a browser to view the launcher.

To open the existing Earth-Moon simulator directly, open:

```text
earth-moon-travel-simulator/index.html
```

The files are static HTML/CSS/JavaScript files and are intended to work on
GitHub Pages without a build step.

## Adding Simulators

Add each simulator as an independent folder at the repository root.

Folder names should describe the simulator purpose and should not use numeric
prefixes.

Good:

```text
earth-moon-travel-simulator
```

Avoid:

```text
simulator-01-earth-moon-travel
```

Update `SIMULATION_INDEX.md` and the root launcher when a simulator is added.
