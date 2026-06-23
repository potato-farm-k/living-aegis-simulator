# Simulation Index

This document tracks simulator workspaces in `living-aegis-simulator`.

## Registered Simulators

### Earth-Moon Travel Simulator

Path: `earth-moon-travel-simulator/`

Status: existing simulator linked from launcher

Purpose: Simulation workspace for Earth-Moon travel, distance, and scale references.

Entry: `earth-moon-travel-simulator/index.html`

Current structure confirmed:

- `earth-moon-travel-simulator/index.html`
- `earth-moon-travel-simulator/README.md`

Notes:

- Preserve existing behavior during repository scaffold work.
- Do not rename the entry file or refactor the simulator structure as part of scaffold updates.
- The current simulator keeps its CSS and JavaScript inside `index.html`; no separate assets folder was present during this scaffold pass.
- A nested `.git/` directory was present inside the existing simulator folder and was left untouched.

## Future Entries

Add new simulators here when they are introduced. Use descriptive folder names
without numeric prefixes.
