# Noirsito UI

A minimalist, high-performance Vue 3 & Nuxt 4 component registry built with mathematical precision, Golden Ratio typography, and direct local source code injection.

Unlike traditional UI component libraries that require heavy runtime dependencies, Noirsito UI provides zero-dependency Vue 3 Single File Components (SFCs) that you copy or inject directly into your codebase. You retain 100% code ownership with zero technical debt.

---

## Features

- **Direct Source Injection**: Inject raw TypeScript & Vue 3 SFCs directly into `./components/ui/` using a single CLI command.
- **Direct DOM Performance**: Canvas interactions and physics simulations bypass Vue's reactivity proxy layer for smooth 60fps execution.
- **Isolated CSS Containment**: Strict layout containment (`contain: paint layout`) and overscroll containment prevent viewport shifts and GPU thread thrashing.
- **Paper & Ink Aesthetic**: Editorial typography (Athelas Serif & Moara Sans) paired with curated Rust (`#C1502E`) and Mustard (`#E3A008`) brand color accents.
- **Fully Typed**: Written in strict TypeScript with comprehensive prop definitions and emit signatures.

---

## Quick Start (CLI Usage)

You do not need to install `noirsito-ui` as a package dependency. Run the CLI tool in any Vue 3 or Nuxt project directory:

```bash
npx noirsito-ui add <component-name>
```

### Examples

```bash
# Add Corner Stars Canvas component
npx noirsito-ui add corner-stars

# Add Pixel Matrix Canvas component
npx noirsito-ui add pixel-matrix

# Add Dynamic Island Navigation component
npx noirsito-ui add dynamic-island
```

The CLI automatically fetches the component source and creates `./components/ui/<ComponentName>.vue` inside your project.

---

## Available Components

| CLI Identifier | Component Title | Category | Description |
| :--- | :--- | :--- | :--- |
| `corner-stars` | Corner Stars Canvas | Animations | Interactive corner starfield canvas animation with constellation implosion dynamics. |
| `dynamic-island` | Dynamic Island Nav | Navigation | Minimalist expandable top pill navigation bar with smooth tab state transitions. |
| `floating-skills` | Floating Skills Physics | Animations | 2D physics canvas simulation rendering interactive floating skill bubbles. |
| `fractal-tree` | Fractal Tree Canvas | Animations | Recursive mathematical fractal tree canvas rendering real-time wind motion. |
| `lissajous-orbit` | Lissajous Orbit | Animations | Harmonic Lissajous curve orbital canvas animation with smooth particle trails. |
| `page-transition-sheet` | Page Transition Sheet | Modals | Tactile page transition drawer sheet with backdrop blur and gesture dismissal. |
| `pixel-matrix` | Pixel Matrix Canvas | Animations | Interactive digital pixel matrix grid canvas with mouse proximity ripple effects. |
| `ribbon-cut` | Ribbon Cut Canvas | Animations | Interactive ribbon-cut particle canvas with mouse slicing motion effects. |
| `command-palette` | App Command Palette | Modals | Keyboard-first command palette modal container with search shortcuts. |
| `app-grain` | App Grain Overlay | Animations | Tactile noise texture grain overlay for modern paper & dark background aesthetics. |

---

## Local Development

To run the component showcase registry locally:

```bash
# Clone repository
git clone https://github.com/Dhruv-Mann/Noirsito-UI.git
cd Noirsito-UI

# Install dependencies
npm install

# Start Nuxt dev server
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## Production Build & Deployment

Build for production:

```bash
npm run build
```

This project is configured for one-click deployment on [Vercel](https://vercel.com) via Nitro serverless functions (`nitro: { preset: 'vercel' }`).

---

## License

[MIT License](LICENSE) © 2026 Noirsito UI
