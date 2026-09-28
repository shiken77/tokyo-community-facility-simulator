# Tokyo Community Facility Simulator

An interactive research prototype for evaluating targeted community-facility interventions in Tokyo's 23 wards.

**Live demo:** https://shiken77.github.io/tokyo-community-facility-simulator/

## What the prototype shows

- A Tokyo 23-ward map with a 1 km mesh overlay and candidate problem communities.
- A scenario interface for selecting a community and facility type.
- Two complementary policy outcomes: **place-based benefit** and **resident benefit**.
- A connected demonstration for Ojima 4-chome using a hobby and self-development facility scenario.

The current public version is a research demonstration. Ojima 4-chome is the only scenario connected to simulation results; the remaining communities and facility types are interface placeholders for planned extensions.

## Research context

The project studies whether targeted support for commercial leisure and self-development facilities can improve older residents' activity opportunities while stimulating local activity. It combines spatial community diagnosis with counterfactual activity-sequence simulation and reports outcomes from both the intervention area's perspective and the residents' perspective.

## Run locally

```bash
npm install
npm run dev
```

To build the static GitHub Pages version:

```bash
npm run build:pages
```

## Technology

React, TypeScript, Vite, Leaflet, OpenStreetMap, and Tokyo 1 km mesh data.

## Author

Sijian Tian
