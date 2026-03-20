# MyE46
A browser-based Agentic 3D BMW E46 build planner for enthusiasts. Drop parts onto a detailed E46 model, dial in colors, set your stance, and ask the built-in AI advisor to build your dream car.

<img width="1918" height="989" alt="demo" src="https://github.com/user-attachments/assets/b58b49ff-b16b-44c6-b2b3-79431fcb8fa4" />

## What can it do?
 
- **Build in 3D** — swap front bumpers, rear bumpers, wheels, spoilers, mirrors, side vents, headlights, roof styles, and badges on a detailed E46 model
- **Color everything** — primary body, secondary trim, rim finish, caliper color, and interior trim with preset swatches or custom hex picker
- **Window tint** — 6 levels from factory clear to limo dark
- **Ride height** — adjustable stance from stock to slammed, visually accurate (body drops while wheels stay planted)
- **Live budget tracking** — total cost updates in real time as you configure
- **Style presets** — one-click OEM+, Clean Daily, Aggressive Street, or Track-Inspired builds
- **AI Garage** — describe the build you want in plain English and the AI configures the car in real time, with budget awareness
- **Save & compare** — save multiple builds, rename them, compare any two side-by-side with visual diffs
- **Share builds** — generate a URL that loads your exact configuration for anyone who opens it
- **Cinematic camera** — camera automatically flies to the relevant angle when you change parts
- **Environment presets** — switch between Studio, Outdoor, Night, and Showroom lighting
 
## Quick start
 
**Just the configurator (no AI):**
 
```bash
npm install
npm run dev
```
 
Open `http://localhost:3000` in your browser. That's it.
 
**With the AI Garage:**
 
You need Node.js 18+ and a Google Gemini API key (free tier available).
 
```bash
npm install
 
# Create a .env file with your API key
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env
 
# Run both frontend and backend
npm run dev:all
```
 
Then open `http://localhost:3000`. The AI panel in the configurator connects to the backend automatically.
 
**Getting a Gemini API key:**
 
1. Go to [Google AI Studio](https://aistudio.google.com)
2. Click "Create API key"
3. Copy it into your `.env` file
 
The free tier gives you 1500 requests/day — plenty for personal use.
 
## Pages
 
| Route | What it does |
|-------|-------------|
| `/` | Landing page — 3D hero with scroll-driven camera, feature overview |
| `/configurator` | Main build experience — 3D viewport, control panel, AI Garage |
| `/builds` | Saved builds manager — cards with color swatches, part summaries, CRUD |
| `/compare` | Side-by-side build comparison with diff highlighting |
 
## How the configurator works
 
The 3D model is a single GLB file containing every part variant for the entire car. Nothing is loaded or unloaded at runtime — customization works entirely by toggling `node.visible` on named nodes in the scene graph.
 
There are three slot types:
 
- **Single-node** — one node per option (spoilers, roof, badges)
- **Paired** — two nodes toggle together (front bumpers with trim, mirrors left+right, rear bumpers with exhaust tips)
- **Quad** — four nodes per style (wheels, one per corner)
 
Colors work by traversing target nodes and cloning materials before mutating them. Each color system targets specific material name patterns:
 
- Body paint → `e46racing_body`, `e46racing_body_2`, `e46racing_body_parts`
- Rim color → `e46racing_bbs`, `e46racing_wheel`, etc.
- Secondary, interior, and caliper colors → all meshes on their respective nodes
- Window tint → `e46racing_glass` with opacity/color from a tint level map
 
Ride height moves the entire car group down, then offsets wheels, tires, and calipers back up by the same amount so the body drops while rolling stock stays planted.
 
## How the AI works
 
When you send a message, the app:
 
1. Snapshots your current build state (all colors, parts, ride height)
2. Sends it to the Express backend along with your message and conversation history
3. The backend constructs a system prompt containing the full parts catalog with prices, style tags, valid values per slot, and behavioral rules
4. Streams the response from Gemini 2.5 Flash back to the browser as Server-Sent Events
5. Parses a JSON config block from the response and auto-applies it via `applyPreset()`
6. Displays the AI's explanation in the chat panel
 
The AI respects budget constraints, uses style tags (`oem`, `aggressive`, `track`, `clean`) to match parts to vibes, and explains its choices concisely.
 
You can revert any AI suggestion with one click — the app snapshots your state before every AI change.
 
## Environment presets
 
| Preset | Background | HDRI | Vibe |
|--------|-----------|------|------|
| Studio | Warm beige | City | Clean, neutral, detailed inspection |
| Outdoor | Blue-grey sky | Sunset | Golden hour warmth, natural reflections |
| Night | Near-black | Night | Dramatic spotlights, moody contrast |
| Showroom | Dark charcoal | Warehouse | Premium car photography, sharp highlights |
 
Background color transitions smoothly between presets. Each preset defines its own light configuration (ambient, directional, spot, and point lights), shadow opacity, and shadow blur.
 
## Project structure
 
```
src/
  components/
    scene/
      Experience.tsx           Three.js canvas, dynamic lighting, camera controls
      E46Model.tsx             GLB loader, visibility, materials, ride height
      LandingModel.tsx         Simplified model for landing page turntable
      LandingExperience.tsx    Scroll-driven camera for landing page
    ui/
      ControlPanel.tsx         Master sidebar composing all slot selectors
      SlotSelector.tsx         Reusable part picker per slot
      ColorPicker.tsx          Swatch grid + native color input
      RideHeightSlider.tsx     Range slider with mm display
      PriceBar.tsx             Live build total
      PresetBar.tsx            One-click style preset buttons
      ConfiguratorHeader.tsx   Top bar with save/share/reset/nav
      SaveBuildModal.tsx       Name and notes form for saving builds
      ShareBuildModal.tsx      URL generation and copy for sharing
      BuildCard.tsx            Saved build card with load/rename/delete
      BuildSelector.tsx        Dropdown for picking builds in compare view
      CompareTable.tsx         Side-by-side diff table with highlights
      AICopilotPanel.tsx       Collapsible AI chat with starter prompts
      AIChatMessage.tsx        Streaming message bubbles with apply/revert
      EnvironmentSwitcher.tsx  Floating preset selector in viewport
  store/
    buildStore.ts              Zustand store — all state, actions, persistence
  hooks/
    useAICopilot.ts            Chat state, streaming, parsing, snapshot/revert
    useCinematicCamera.ts      Slot-aware camera transitions
  services/
    aiClient.ts                SSE streaming client for /api/chat
  utils/
    buildUrl.ts                Encode/decode builds to URL-safe base64
  data/
    mods.json                  Full parts catalog with prices and style tags
    slots.ts                   Node mappings for all slot types
    presets.ts                 4 curated style presets
    cameraPositions.ts         Camera angles per slot category
    environments.ts            Environment preset definitions
  types/
    index.ts                   BuildConfig, PartDefinition, StylePreset
  pages/
    Landing.tsx                3D hero landing with scroll-driven camera
    Configurator.tsx           Main build experience
    Builds.tsx                 Saved builds manager
    Compare.tsx                Side-by-side comparison
 
server/
  server.js                    Express backend — Gemini proxy + static serving
  systemPrompt.js              Builds the AI system prompt from parts catalog
 
public/
  models/
    e46.glb                    The E46 3D model (CC Attribution)
```
 
## Tech stack
 
| What | How |
|------|-----|
| Frontend | React 18 + TypeScript, Vite |
| 3D | React Three Fiber + Drei |
| State | Zustand with persist middleware |
| Styling | Plain CSS — variables, no frameworks |
| Routing | React Router v6 |
| AI model | Gemini 2.5 Flash (Google) |
| AI features | Streaming SSE, function-style config output, conversation memory, budget constraints |
| Backend | Express — single proxy route, zero auth |
| Persistence | localStorage for builds, URL encoding for sharing |
 
## .env reference
 
| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes (for AI) | Google Gemini API key ([get one here](https://aistudio.google.com)) |
| `PORT` | No | Server port (default: 3001) |
 
The AI features are optional. The configurator works fully without a backend — you just won't have the AI Garage chat panel.
 
## Deployment
 
The app deploys as a single service. Express serves both the API and the built frontend.
 
```bash
npm run build              # Vite builds to dist/
node server/server.js      # Express serves dist/ + /api/chat
```
 
For Render, Vercel, Railway, or similar:
 
- **Build command:** `npm install && npm run build`
- **Start command:** `node server/server.js`
- **Environment variable:** `GEMINI_API_KEY`
 
## Credits
 
- 3D model by **Merc_TV** ([@szymonpasterczyk](https://sketchfab.com)) — CC Attribution license
