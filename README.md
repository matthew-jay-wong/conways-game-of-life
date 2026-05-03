# Conway's Game of Life

An interactive browser implementation of [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) built with React and TypeScript.

## Features

- Click cells to toggle them alive or dead
- Configurable grid dimensions (X × Y)
- Generation counter
- Start / Stop / Clear controls
- Game loop runs in a **Web Worker** via BroadcastChannel, keeping the UI thread unblocked

## Tech Stack

- React 19 · TypeScript · Vite
- Web Workers + BroadcastChannel API for off-thread simulation

## Running Locally

```bash
npm install
npm run dev
```

## Rules

A cell's next state follows Conway's four rules:

1. A live cell with 2 or 3 live neighbours survives.
2. A dead cell with exactly 3 live neighbours becomes alive.
3. All other live cells die in the next generation.
4. All other dead cells stay dead.

The grid wraps toroidally (edges connect to the opposite side).
