Set up the project foundation for the open-world airline career simulator.

Read these files first:
- README.md
- AGENTS.md
- docs/Vision.md
- docs/Architecture.md
- docs/DevelopmentRoadmap.md
- docs/VersionOneScope.md

Create the initial technical foundation for the project.

Requirements:
- Use a single pnpm workspace monorepo.
- Create apps/marketing for the marketing website using React, TypeScript, and Vite.
- Create apps/game for the main large-screen game client using React, TypeScript, and Vite.
- Create apps/server for the backend API using Node.js, TypeScript, and Fastify.
- Create packages/game-core for pure simulation/game logic.
- Create packages/game-data for game data definitions and loaders.
- Create packages/shared for shared types, schemas, and utilities.
- Add TypeScript configuration shared across the repo.
- Add linting and formatting setup.
- Add Vitest testing setup where appropriate.
- Add basic placeholder tests to prove the workspace test command works.
- Add scripts at the root for dev, build, lint, test, typecheck, and format.
- Ensure simulation logic is not placed in UI apps.
- Ensure the backend does not duplicate game logic.
- Do not implement gameplay systems yet.
- Do not implement UI beyond default placeholder pages.
- Do not add future branch features.
- Do not replace the project docs or change the design direction.

Definition of done:
- The monorepo installs successfully.
- The marketing app starts.
- The game app starts.
- The server starts with a basic health endpoint.
- Typecheck passes.
- Tests pass.
- Lint passes or is configured clearly.
- The folder structure matches docs/Architecture.md.
- Any assumptions are documented in a short implementation note.
