# MyE46

A browser-based 3D build planner for BMW E46 enthusiasts. Customize your E46 in real time, preview visual mods, track your budget, save builds, and compare configurations — all without leaving your browser.

![BMW E46](https://img.shields.io/badge/platform-BMW_E46-blue) ![License](https://img.shields.io/badge/3D_model-CC_Attribution-green)

## What can it do?

- **Build in 3D** — swap bumpers, wheels, spoilers, mirrors, side vents, badges, and more on a detailed E46 model right in your browser
- **Paint and color** — change body paint and rim color independently with instant preview
- **Ride height** — dial in your drop and see it reflected on the model
- **Style presets** — load curated builds like OEM+, Clean Daily, Aggressive Street, and Track-Inspired with one click
- **Budget tracker** — every part has a real price, so you always know what your build costs
- **Save builds** — store multiple configurations in your browser and come back to them anytime
- **Compare builds** — put two saved configs side by side to see the differences
- **No backend required** — everything runs client-side with localStorage persistence

## Quick start

You need Node.js 18+ installed.
```bash
git clone https://github.com/AzizSyed27/mye46.git
cd mye46
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser. That's it.

## How the 3D model works

The car is a single GLB file containing every part variant — all bumpers, all wheel styles, all spoilers — loaded into the scene at once. Customization works by toggling `node.visible = true/false` on named nodes inside the model. Nothing is loaded or unloaded at runtime. Everything is already in memory.

There are three types of slots:

| Slot type | How it works | Example |
|-----------|-------------|---------|
| **Single-node** | One node per option, toggle by name | `front_bumper_stock`, `front_bumper_m3` |
| **Paired** | Two nodes toggle together | `left_mirror_m3` + `right_mirror_m3` |
| **Quad** | Four nodes toggle as a set | All four `rim_style_37_*` wheels |

Paint color targets every external body panel by node name — not a single material. Rim color targets wheel meshes separately. Both use a clone-then-set pattern so materials don't bleed between parts.

## Available modifications

| Category | Options |
|----------|---------|
| Front bumper | Stock, Mtech1, ZHP, M3 |
| Front lip | None, Lip |
| Rear bumper | None, Mtech2 (single exhaust), Mtech2 (dual exhaust), M3 |
| Wheels | BBS CHR, Style 37, Style 119, Style 135, Style 166 |
| Mirrors | Stock, M3 |
| Side vents | None, M side vents |
| Spoiler | None, Stock, Roof, Ducktail |
| Roof | Standard, Sunroof |
| Badge | 318i, 320d, 320i, 325i, 325xi, 330d, 330dx, 330i, 330xi, M3 |
| Paint color | Any hex color |
| Rim color | Any hex color |
| Ride height | Adjustable drop |

## Style presets

| Preset | Vibe | Key parts |
|--------|------|-----------|
| **OEM+** | Subtle factory-plus look | Mtech1 bumper, Style 37 wheels, mild drop |
| **Clean Daily** | Tasteful street build | BBS CHR wheels, projectors, M3 mirrors, roof spoiler |
| **Aggressive Street** | Loud and low | ZHP bumper, front lip, ducktail, dark wheels, slammed |
| **Track-Inspired** | Race-ready aesthetic | M3 bumpers, Style 166 wheels, full aero, maximum drop |

## Project structure
```
src/
  components/
    scene/
      Experience.tsx       Three.js canvas, lighting, camera
      E46Model.tsx         Loads GLB, handles visibility + materials
    ui/                    Control panels
  store/
    buildStore.ts          Zustand store — all state and actions
  hooks/                   Custom React hooks
  data/
    mods.json              Part definitions, prices, node mappings
    slots.ts               Slot type definitions and node groupings
    presets.ts             Style preset configurations
  types/
    index.ts               TypeScript interfaces
  pages/
    Landing.tsx            Home page
    Configurator.tsx       Main 3D build experience
    Builds.tsx             Saved builds manager
    Compare.tsx            Side-by-side comparison
  styles/
    global.css             CSS variables, reset, base styles
  App.tsx                  Router setup
  main.tsx                 Entry point

public/
  models/
    e46.glb                Complete 3D model with all variants
```

## Tech stack

| What | How |
|------|-----|
| Framework | React + TypeScript |
| Bundler | Vite |
| 3D engine | React Three Fiber + Drei |
| State | Zustand with persist middleware |
| Styling | Plain CSS with CSS variables |
| Routing | React Router |
| Storage | localStorage (no backend) |

## Design philosophy

MyE46 is designed to feel like a premium enthusiast tool — not a game, not a generic car configurator, not a marketplace. The 3D car is the hero. UI panels are secondary and never crowd the viewport. The visual direction is dark, luxurious, and automotive — think warm accent tones on dark surfaces with clean typography.

## Roadmap

- [x] 3D model with full part visibility toggling
- [x] Paint and rim color customization
- [x] Style presets
- [x] Save and load builds via localStorage
- [x] Build comparison view
- [ ] **AI Garage** — a chat-based co-pilot inside the configurator that builds cars from plain-English prompts like *"aggressive street build under $5000"*
- [ ] **Shareable build links** — URL-encoded configs so you can send your build to anyone

## 3D model credit

The E46 model is used under a [CC Attribution license](https://creativecommons.org/licenses/by/4.0/).
Credit: **Merc_TV** ([@szymonpasterczyk](https://sketchfab.com/szymonpasterczyk)) on Sketchfab.

## License

MIT
