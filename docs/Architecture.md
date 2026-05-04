# Architecture

The project is a single public monorepo.

The game is designed around a large-screen core client, a backend-backed save system, and a future mobile companion.

The first playable client is the large-screen game app. It may run as a web app first and may later be packaged as a desktop app.

The marketing website is separate from the game client. It is used for the landing page, project information, screenshots, roadmap, devlogs, and other public-facing pages.

The mobile companion is a future secondary client for monitoring, reports, simple actions, and catch-up. It is not the primary story gameplay client.

## Repository Layout

- `apps/marketing`: public website and landing pages
- `apps/game`: large-screen game client
- `apps/server`: backend API
- `packages/game-core`: pure simulation engine
- `packages/game-data`: aircraft, airports, contracts, objectives, and story data
- `packages/shared`: shared types, schemas, and API contracts

## Core Rule

Simulation logic lives in `packages/game-core`.

The game client, backend, desktop wrapper, and future mobile companion should not duplicate simulation rules.

Manual simulation and operations catch-up should use the same core simulation logic.

## Frontend

Both the marketing site and game client use React with Vite.

The marketing site and game client are separate apps because they have different goals.

The marketing site should be lightweight, public-facing, and content-focused.

The game client should be large-screen focused and optimized for simulator gameplay.

## Backend

The backend uses Node.js, TypeScript, and Fastify.

The backend is responsible for:

- User identity mapping
- Airline save storage
- Loading and saving game state
- Running operations catch-up
- Persisting reports
- Validating game actions
- Protecting major game state changes
- Serving data needed by the game client and future mobile companion

The backend should stay focused. It should not contain duplicated simulation rules.

When backend logic needs to simulate the game, it should call `packages/game-core`.

## Authentication

Firebase Auth is used for authentication.

The backend verifies Firebase ID tokens and maps Firebase users to internal database users.

Firebase Auth is used because it is already familiar from other projects and helps avoid building custom authentication early.

## Database

Postgres is the preferred database.

Postgres can run locally, on a VPS, or on a managed cloud provider later if storage or reliability needs grow.

The project should avoid database choices that make migration difficult.

The first implementation may use JSONB save snapshots for flexibility.

The database design should avoid unnecessary storage growth and support future migration.

## ORM

Prisma is the preferred ORM for the initial backend.

Prisma is used because it provides:

- A clear schema file
- Type-safe generated client code
- Migration tooling
- Strong documentation and examples
- Good compatibility with a TypeScript backend

The ORM choice can be revisited later if needed, but the initial priority is developer speed and clarity.

## Save Strategy

The backend stores airline save data in Postgres.

Early versions may store most game state as JSONB snapshots, with metadata stored in normal relational columns.

This allows fast iteration while the game model is still changing.

Over time, frequently queried or large pieces of state can be normalized into separate tables.

Possible saved data includes:

- User
- Airline metadata
- Current save state
- Aircraft
- Routes
- Schedules
- Contracts
- Career objectives
- Simulation reports
- Last simulated time

## Operations Catch-Up

Operations catch-up should run through the backend using `packages/game-core`.

Catch-up should be triggered when the player opens the game or explicitly requests catch-up.

The server should:

1. Load the airline save.
2. Calculate eligible catch-up time.
3. Run catch-up through the shared simulation engine.
4. Stop if blocking events occur.
5. Save the updated game state.
6. Return a catch-up report.

Catch-up should not trigger major story decisions automatically.

## Platform Direction

Version 1.0 focuses on the large-screen game app.

The game may first run as a web app.

Future platform options:

- Desktop package through Tauri
- Mobile companion through PWA or mobile app
- Hosted web version using the same backend

The architecture should avoid assumptions that make these future options difficult.

## Mobile Companion Direction

The future mobile companion should not be a full replacement for the large-screen game client.

The companion may support:

- Airline status monitoring
- Cash and finance summaries
- Fleet status
- Route status
- Recent reports
- Catch-up reports
- Simple operations controls
- Pausing operations

The companion should not initially support:

- Major story decisions
- Complex route planning
- Complex schedule editing
- Partner breakaway decisions
- Full campaign progression

## Development Priorities

The first technical priority is a stable shared simulation core.

The second priority is backend-backed saves.

The third priority is the large-screen game client.

The marketing site can be built early but should not distract from the core game.

## Cost Awareness

The project should remain as close to no-cost as possible during early development.

Preferred early deployment approach:

- Static marketing and game client hosting where possible
- Backend hosted on existing VPS if needed
- Postgres hosted on the existing VPS at first
- Firebase Auth for low-cost authentication
- Managed cloud database only if storage, reliability, or scaling needs require it

The project should avoid paid dependencies unless they are clearly necessary.
