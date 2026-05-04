# Airline Career Simulator

An open-world airline career simulator where the player starts as the founder of a tiny air service and grows into a larger airline through story progression, contracts, route planning, aircraft decisions, scheduling, and business management.

The game blends simulator mechanics with a guided career storyline. The player can follow the main progression path, take side contracts, grow at their own pace, and shape the identity of their airline over time.

This project is currently in early design and pre-production.

## Core Idea

The simulator is the world. The airline is the player’s character. Airports, aircraft, routes, schedules, contracts, finances, partnerships, and reputation are the tools for progression.

The main story provides structure, but the player decides how quickly to move forward.

## Current Direction

The first version focuses on the early airline career:

- Starting as a founder with one small aircraft
- Opening early routes
- Building a stable scheduled operation
- Using operations catch-up to simulate stable flights while away
- Completing career objectives and side contracts
- Reaching the first regional partner opportunity

## Project Structure

```txt
docs/       Design documents and planning
data/       Raw and curated game data
src/        Game source code
```

## Status

Pre-production. The design is being defined before implementation.

## Planned Tech Stack

- Monorepo with pnpm workspaces
- React + Vite for the marketing site
- React + Vite for the large-screen game client
- Node.js + TypeScript + Fastify for the backend API
- Firebase Auth for authentication
- Postgres for game data and saves
- Prisma for database access and migrations
- Shared TypeScript simulation logic in `packages/game-core`

## License

This project is licensed under the GNU General Public License v3.0.

See `LICENSE` for details.

## Assets and Game Content

The source code is licensed under GPL-3.0. Future original art, branding, music, writing, aircraft names, airline names, and other creative assets may use separate licensing terms.
