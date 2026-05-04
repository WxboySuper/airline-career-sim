# Project Foundation Implementation Note

This foundation follows the repository layout in `docs/Architecture.md` and keeps the first pass limited to technical scaffolding.

## Design Docs Used

- `README.md`
- `AGENTS.md`
- `docs/Vision.md`
- `docs/Architecture.md`
- `docs/DevelopmentRoadmap.md`
- `docs/VersionOneScope.md`

## Assumptions

- The first server milestone only needs a basic health endpoint; authentication, database access, Prisma, and save storage are intentionally left for later phases.
- The marketing and game clients use default placeholder React pages until gameplay and UI systems are designed.
- Shared package exports are minimal placeholders so package boundaries can be verified without implementing gameplay systems.

## Out of Scope

- Gameplay systems
- Save/load persistence
- Authentication
- Database schema and migrations
- Simulator UI beyond placeholder pages
- Future branch features listed in the roadmap and Version 1.0 scope
