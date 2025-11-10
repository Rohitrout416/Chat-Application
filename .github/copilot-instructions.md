<!-- Purpose: concise instructions to help AI coding agents be immediately productive in this repository. -->
# Copilot / AI agent instructions for this repository

Repository snapshot
- Repo path: `chat-socket` (currently contains no source files or README as of this commit).

If you are an AI assistant working in this repo, follow these prioritized steps first:

1) Quick reconnaissance (mandatory)
 - Look for these files in the repo root (in this order): `package.json`, `pyproject.toml`, `requirements.txt`, `go.mod`, `Cargo.toml`, `Dockerfile`, `README.md`, `src/`, `server/`, `client/`.
 - If none exist (as now), report the empty state in the PR description and ask the maintainer whether you should scaffold a minimal chat-socket example.

2) If you are asked to implement or fix features, identify the project type before changing code.
 - Node.js indicators: `package.json`, `tsconfig.json`, `src/` with `.js`/`.ts` files. Typical commands: `npm install`, `npm run dev`, `npm test`.
 - Python indicators: `pyproject.toml` or `requirements.txt` and `src/` or `app/`. Typical commands: `python -m venv .venv; .\.venv\Scripts\Activate.ps1; pip install -r requirements.txt; pytest`.

3) Chat-socket specific expectations (only apply when code exists)
 - Expect a WebSocket or socket server component (look for `ws`, `socket.io`, `websockets`, `aiohttp`, or `uvicorn` references).
 - Look for two logical components: a server-side socket handler (usually under `server/`, `src/server`, or `src/back`) and a client front-end (under `client/`, `public/`, or `src/front`).
 - Message flow: client -> socket transport -> server handler -> broadcast or targeted reply. Try to find test files that assert message shape or events (look for `message`, `connect`, `disconnect`).

4) When repository is empty and scaffolding is requested
 - Propose a minimal, easily-reviewable scaffold and describe it in the PR. Example scaffold (Node.js minimal):
   - `package.json` (with scripts: `dev`, `start`, `test`)
   - `src/server.js` — Express + `ws` or `socket.io` sample
   - `public/index.html` — minimal client connecting to the socket
   - `README.md` — usage & dev commands
 - Use small, focused PRs (one responsibility per PR). Don't scaffold everything in a single large change without confirmation.

5) Build / test / debug workflows (Windows PowerShell examples)
 - Node.js quick dev (if Node detected):
   ```powershell
   npm install; npm run dev
   ```
 - Run tests (common):
   ```powershell
   npm test
   # or
   pytest
   ```
 - Docker: if a `Dockerfile` exists, prefer `docker build -t chat-socket .` then `docker run -p 3000:3000 chat-socket`.

6) Agent editing rules (stay conservative)
 - Prefer creating small, reversible changes and include a short smoke-test in the PR description.
 - Avoid changing unrelated files (lockfiles, CI, infra) unless the change is required and explained.
 - If unsure about architecture, open an issue-sized PR that implements a tiny end-to-end feature (example: simple echo websocket server + client page) and request review.

7) Commit / PR notes for maintainers
 - Describe what you changed, why, how to run locally (commands), and one manual smoke-test (e.g., open `http://localhost:3000` and verify message echo).

8) When you finish a change
 - Run the small verification steps you listed in the PR body (install/build/test). Report results and any errors.

Files to reference when they appear
- `package.json` — scripts and dependencies are canonical indicators for workflow commands.
- `src/server.js` or `src/index.ts` — look here for socket server logic.
- `public/index.html` or `client/` — look here for sample client behavior and event names.
- `Dockerfile`, `.github/workflows/*` — CI and containerization hints.

If anything in this file is unclear or you'd like me to generate the initial scaffold now, tell me whether you prefer Node.js or Python as the base and I will create a minimal example and run the smoke tests.
