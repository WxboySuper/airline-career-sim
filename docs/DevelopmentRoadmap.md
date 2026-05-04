# Development Roadmap

This roadmap is designed for AI-assisted development.

Agents can move quickly, but the project should not become scattered. The goal is to build the stable vertical trunk first, then branch outward.

The first priority is to make the core open-world airline career simulator playable from founder operation to the first regional partner contract.

## Development Philosophy

Build in narrow, testable layers.

Each phase should create something useful without silently adding unrelated future systems.

Simulation logic should be built before complex UI polish.

Story progression should be data-driven where possible.

Catch-up and manual simulation should share the same simulation engine.

The project should favor systems that can expand later without needing full rewrites.

## Phase 1: Project Foundation

Goal: create the technical base.

Deliverables:

- Project setup
- Basic folder structure
- TypeScript configuration
- Testing setup
- Linting and formatting
- Data folder structure
- Initial docs in place

Definition of done:

- Project runs locally
- Tests can run
- Docs are present
- Source structure separates game logic from UI

## Phase 2: Core Data Models

Goal: define the main game objects.

Deliverables:

- Airline model
- Airport model
- Aircraft manufacturer model
- Aircraft type model
- Aircraft instance model
- Route model
- Scheduled flight model
- Contract model
- Career objective model
- Simulation report model
- Save game model

Definition of done:

- Models are strongly typed
- Sample objects can be created
- Save game state can serialize and deserialize
- Tests cover basic model behavior

## Phase 3: Airport Data Pipeline

Goal: turn raw airport data into playable game data.

Deliverables:

- Raw airport loader
- Airport importer
- Curated airport record format
- Airport class assignment
- Starting airport eligibility
- Basic demand placeholders
- Manual override support

Definition of done:

- Raw airports can be loaded
- Playable airport records can be generated or curated
- Tiny/private airports can be filtered or classified
- Tests cover importer behavior

## Phase 4: Aircraft Catalog and Acquisition

Goal: create the first usable aircraft progression layer.

Deliverables:

- Fictional aircraft manufacturers
- Founder aircraft
- Commuter aircraft
- Small regional turboprops
- Large regional turboprops
- Small regional jets
- Large regional jets
- Basic acquisition options
- Used purchase support
- Operating lease support
- Aircraft condition and reliability

Definition of done:

- Player can acquire aircraft
- Aircraft have meaningful differences
- Aircraft belong to manufacturers
- Acquisition affects finances
- Tests cover acquisition and ownership behavior

## Phase 5: Route System

Goal: allow the player to open and evaluate routes.

Deliverables:

- Route creation
- Distance calculation
- Basic demand model
- Fare setting
- Aircraft suitability checks
- Route performance history

Definition of done:

- Routes can be created between eligible airports
- Aircraft can be checked against route requirements
- Basic demand and revenue potential can be estimated
- Tests cover route creation and suitability

## Phase 6: Scheduling System

Goal: make time and aircraft utilization matter.

Deliverables:

- Aircraft daily schedule
- Scheduled flights
- Departure times
- Block time calculation
- Turn time
- Conflict detection
- Utilization calculation

Definition of done:

- Player cannot schedule impossible aircraft rotations
- Flights can be assigned to aircraft
- Schedule conflicts are detected clearly
- Tests cover valid and invalid schedules

## Phase 7: Simulation Engine

Goal: run airline operations.

Deliverables:

- Manual time advancement
- Flight operation simulation
- Passenger revenue
- Operating costs
- Aircraft usage
- Aircraft condition changes
- Cash updates
- Route performance updates
- Simulation reports

Definition of done:

- The game can simulate at least one day of operations
- The same schedule can succeed or fail based on route/aircraft/costs
- Simulation reports explain what happened
- Tests cover profitable, unprofitable, and invalid operations

## Phase 8: Operations Catch-Up

Goal: let the airline continue stable operations while the player is away.

Deliverables:

- Last simulated time tracking
- Real-time to game-time conversion
- Catch-up simulation
- Catch-up stopping rules
- Catch-up report

Definition of done:

- Catch-up uses the same core simulation engine as manual advancement
- Catch-up earns revenue and applies costs
- Catch-up does not trigger major story decisions automatically
- Catch-up stops for blocking events
- Tests cover catch-up behavior

## Phase 9: Career Objectives

Goal: give the player guided progression.

Deliverables:

- Career objective definitions
- Objective requirements
- Objective rewards
- Objective chains
- Act 1 objectives
- Act 2 objectives
- Act 3 objectives

Definition of done:

- Objectives can activate, progress, complete, and reward the player
- Objectives guide the player from founder operation toward partner opportunity
- Tests cover objective progression and rewards

## Phase 10: Contracts

Goal: add optional side objectives.

Deliverables:

- Contract definitions
- Contract requirements
- Contract rewards
- Contract expiration or duration
- Early challenge contracts
- First partner feeder contract structure

Definition of done:

- Player can accept optional contracts
- Contracts progress through simulation
- Contracts can succeed or fail
- Contracts provide rewards or penalties
- Tests cover contract lifecycle

## Phase 11: Partner System

Goal: introduce the first major story/business relationship.

Deliverables:

- Fictional partner airline
- Partner offer trigger
- Partner contract
- Partner route requirements
- Partner reliability requirements
- Partner rewards
- Partner restrictions
- Partner-connected aircraft structures

Definition of done:

- Player can receive a partner offer
- Player can complete a partner contract
- Partner flying can involve partner-owned or player-owned aircraft
- Partner restrictions are represented in data
- Future separation logic has enough ownership/control data to build on later

## Phase 12: First Playable UI

Goal: make the first vertical slice playable.

Deliverables:

- Airline creation screen
- Dashboard
- Route view or ops map
- Fleet view
- Schedule board
- Career objectives view
- Contracts view
- Finance view
- Operations report view
- Catch-up report view

Definition of done:

- Player can create an airline
- Player can acquire or use a starting aircraft
- Player can open a route
- Player can schedule flights
- Player can advance time
- Player can receive reports
- Player can complete objectives
- Player can interact with contracts

## Phase 13: Version 1.0 Polish

Goal: make the first release feel coherent.

Deliverables:

- Balance pass
- UI clarity pass
- Early story/advisor messages
- Error and warning improvements
- Save/load hardening
- Basic onboarding
- Test pass
- Documentation updates

Definition of done:

- Version 1.0 career arc is playable
- The game explains what to do next
- Catch-up is understandable
- The player can reach and complete the first partner contract
- The project is ready for tester feedback

## Future Branches

These should come after the vertical trunk is stable.

Possible future branches:

- Full independence and breakaway arc
- Deeper partner negotiation
- National airline expansion
- Hubs and connecting demand
- More advanced competitors
- Airport expansion projects
- International partners
- Alliances
- Cargo operations
- Cabin configuration
- Weather disruptions
- Subsidiaries
- Advanced manufacturer relationships
- Mobile packaging
- Cloud saves

## Agent Guidance

Agents should work phase by phase unless explicitly instructed otherwise.

When implementing a phase, agents should:

- Read the relevant docs first
- State assumptions
- Keep scope narrow
- Add tests
- Avoid adding future branch features prematurely
- Leave TODOs for future systems instead of half-building them
