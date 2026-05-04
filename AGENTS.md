# AGENTS.md

## Project Summary

This project is an open-world airline career simulator.

The player starts as the founder of a tiny independent air service with one small aircraft, limited money, and almost no credibility. Through simulator systems, career objectives, contracts, aircraft progression, route planning, scheduling, partnerships, and business decisions, the player grows into a larger airline over time.

The game is a mashup between a simulator and an open-world progression story game.

The simulator is the world. The airline is the player character. Airports, aircraft, routes, schedules, contracts, finances, partnerships, and reputation are the tools for progression.

The main storyline gives the player direction, but the player controls the game.

## Required Reading Before Planning or Coding

Before implementation plans, architecture changes, gameplay systems, or UI decisions, read:

- `README.md`
- `docs/Vision.md`
- Any relevent documentation in `docs/*`

As more design docs are added, prefer reading the relevant design doc before touching that area.

For example:

- Aircraft logic should be based on the aircraft design document.
- Route logic should be based on the airports/routes design document.
- Story progression should be based on the career storyline document.
- Catch-up simulation should be based on the operations catch-up document.

If a needed design doc does not exist yet, keep the implementation minimal and clearly note assumptions.

## Development Philosophy

Build the stable vertical trunk before branching outward.

The project should first support the core career path:

1. Founder operator
2. Scheduled commuter carrier
3. Regional partner opportunity
4. Regional affiliate growth
5. Future independence path
6. Future national expansion

Do not implement advanced branch features until the trunk is stable.

Branch features include, but are not limited to:

- Airport expansion projects
- International alliances
- Widebody networks
- Cargo systems
- Weather disruption systems
- Subsidiary airlines
- Advanced cabin products
- Complex competitor AI
- Stock market or public company systems

These features may be discussed or stubbed for future expansion, but should not be built unless explicitly requested.

## Creative Freedom

Agents are allowed to suggest ideas.

Useful ideas are welcome when they:

- Strengthen the open-world airline career simulator identity
- Improve the main career progression
- Make simulator systems more coherent
- Reduce future technical debt
- Improve player clarity
- Improve testability
- Preserve the serious simulator tone

Agents should not silently add major new mechanics.

If an idea expands scope, propose it in notes or TODOs instead of implementing it directly.

Good behavior:

> “This system could later support airport expansion projects, but this implementation only adds the fields needed for the current route model.”

Bad behavior:

> Adding airport expansion, construction timers, bond financing, and city council politics while implementing basic airport loading.

## Scope Guardrails

This is not a generic airline tycoon clone.

This is not a short idle game.

This is not a pure visual novel.

This is not a spreadsheet-only simulation.

This is not a childish or parody game.

This is not a SaaS dashboard with planes attached.

The game should feel like a serious airline operations simulator with a story-driven career spine.

## Story and Simulation Relationship

The simulator is the foundation. Story is layered on top of the simulator.

Story progression should happen through:

- Career objectives
- Contract briefings
- Strategic decisions
- Advisor/co-founder messages
- Operations reports
- Partner airline communications
- Unlocks and consequences

Avoid building story as disconnected cutscenes or long dialogue trees unless explicitly requested.

The player should be able to continue operating, optimizing, and expanding outside the main story path.

## Operations Catch-Up Rule

Operations catch-up runs stable scheduled operations while the player is away.

Catch-up may:

- Run existing scheduled flights
- Earn revenue
- Apply operating costs
- Apply lease or loan payments
- Progress active operational contracts
- Progress aircraft usage and condition
- Generate reports

Catch-up must not:

- Trigger major story decisions automatically
- Accept contracts automatically
- Buy or lease aircraft automatically
- Open routes automatically
- Force breakaway decisions
- Make irreversible strategic choices

Manual time advancement and catch-up should use the same simulation engine wherever possible.

## Fictional World Rules

Aircraft and airlines are fictional.

They may be inspired by real-world aircraft categories and airline business models, but should not rely on real airline branding or real aircraft licensing.

Real airports and airport codes may be used.

The airport data source is stored in:

- `data/airports.json`

Raw airport data should not be treated as fully gameplay-ready. Gameplay-specific airport fields should live in curated data or generated derived data.

## UI Direction

The UI should be simulator-focused.

It should feel like an airline operations desk, not a generic SaaS dashboard.

Prefer interfaces such as:

- Route map
- Schedule board
- Fleet ledger
- Career/objective panel
- Contract board
- Finance view
- Operations report

Avoid generic card-heavy layouts unless a card is genuinely the clearest representation for that information.

The UI should always help the player understand:

- What is happening
- Why it is happening
- What they can do next
- What risks they are carrying

## Technical Guardrails

Keep simulation logic separate from UI.

Game logic should be deterministic where practical.

Prefer pure functions for simulation systems.

Manual simulation and catch-up simulation should share core logic.

Use tests for core systems.

Avoid hardcoding gameplay rules inside UI components.

Prefer data-driven definitions for:

- Aircraft
- Airports
- Career objectives
- Contracts
- Unlocks
- Story events

When implementing a system, include enough tests to prove the intended behavior.

## Documentation Expectations

When adding or changing major systems, update the relevant docs.

If documentation is missing, create a small design note before implementing a large system.

Do not let code become the only source of truth for game design.

## Agent Planning Expectations

Before making large changes, produce a brief plan that includes:

- Files or systems being touched
- Design docs used
- Assumptions made
- What is intentionally out of scope
- Tests to add or update

Plans should be practical and scoped. Avoid grand redesigns unless explicitly requested.

## Definition of Done

A task is done when:

- It follows the project vision
- It stays within requested scope
- It keeps simulation logic separate from UI
- It includes relevant tests where practical
- It updates relevant documentation if behavior changes
- It does not silently add unrelated major systems
- It leaves clear TODOs for future branch features instead of half-building them

## When Unsure

If unsure, favor the core vertical trunk.

Ask:

1. Does this support the founder-to-regional-partner career path?
2. Does this make the simulator clearer or more coherent?
3. Does this preserve player freedom without derailing progression?
4. Does this belong now, or is it a future branch feature?

If the answer is unclear, keep the implementation small and document the assumption.

## Implementation Notes

If an agent needs to leave implementation notes, assumptions, task summaries, or temporary handoff notes, place them in `docs/agent-notes/`.

This folder is gitignored and should not be treated as permanent documentation.

Permanent design decisions belong in the normal `docs/` files and should only be updated intentionally.
