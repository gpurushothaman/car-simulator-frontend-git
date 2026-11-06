# Live Envmaps Studio — Next.js JSX

A JavaScript/JSX Next.js App Router project converted from the original React/Vite 3D project.

## Routes
- `/` — Home landing page
- `/about` — About the project
- `/tools` — Color picker, exposure preview, and scene shortcut
- `/scene` — Original interactive 3D Porsche scene

## Run locally
Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```
Then open http://localhost:3000.

The 3D scene uses React Three Fiber and is dynamically loaded on the client because WebGL requires a browser environment. The exposure preview is a demo control and does not currently change the 3D scene's lighting.
