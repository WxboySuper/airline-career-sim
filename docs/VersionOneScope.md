# Version One Scope

Version 1.0 is the first complete vertical trunk of the game.

It should prove the identity of the project: an open-world airline career simulator where story progression and simulation systems work together.

Version 1.0 does not need every future system. It needs the first career arc to feel real, playable, and expandable.

## Version 1.0 Career Scope

Version 1.0 should cover:

- Act 1: Founder Operator
- Act 2: Scheduled Commuter
- Act 3: Regional Partner
- Early Act 4: Affiliate Growth

The player should be able to start with a tiny operation, grow into scheduled service, receive a partner opportunity, complete the first major partner contract, and continue operating as an early affiliate.

The independence/breakaway arc may be teased but does not need full implementation in Version 1.0.

## Included Systems

### Airline Creation

The player can create an airline.

Minimum requirements:

- Airline name
- Starting airport
- Initial cash
- Initial aircraft
- Basic airline identity

### Airport Data

The game uses the raw airport database as a source.

Version 1.0 should include a curated playable airport layer with enough airports for the early career arc.

Minimum requirements:

- Load raw airport data
- Generate or define curated airport records
- Support airport classes
- Support starting airport eligibility
- Support basic demand values

### Aircraft

Version 1.0 should include fictional early aircraft.

Minimum required categories:

- Founder aircraft
- Commuter aircraft
- Small regional turboprop
- Large regional turboprop
- Small regional jet
- Large regional jet

Crossover jets may be added if needed for late Version 1.0 affiliate growth, but are not required for the first playable build.

### Aircraft Manufacturers

Version 1.0 should include the basic idea of competing fictional aircraft manufacturers.

Minimum requirements:

- Aircraft types belong to fictional manufacturers
- Manufacturers have simple identity differences
- Similar aircraft categories may have multiple competing options
- Manufacturer data should support future expansion into loyalty, fleet deals, discounts, and support agreements

Version 1.0 does not need deep manufacturer negotiation, launch customer programs, or complex manufacturer relationship systems.

### Aircraft Acquisition

Version 1.0 should support basic acquisition.

Minimum requirements:

- Starting aircraft
- Operating lease
- Used purchase
- Basic monthly payment or ownership cost
- Aircraft condition
- Aircraft reliability

Future acquisition types can be added later.

### Partner-Connected Aircraft

Version 1.0 should support partner-connected aircraft in a simple but future-proof way.

Partner contracts should not be limited only to partner-owned aircraft. The system should allow different structures:

- Partner-owned aircraft
- Player-owned aircraft used for partner flying
- Partner-financed aircraft
- Mixed contract structures

Version 1.0 may use predefined contract structures rather than full negotiation, but the data model should track who owns, pays for, controls, and restricts aircraft involved in partner flying.

This is important for future independence and breakaway mechanics.

### Routes

The player can open routes between eligible airports.

Minimum requirements:

- Origin
- Destination
- Distance
- Basic demand
- Fare
- Aircraft suitability
- Route performance history

### Scheduling

The player can assign aircraft to flights.

Minimum requirements:

- Aircraft daily schedule
- Departure time
- Arrival time or calculated block time
- Turn time
- Conflict detection
- Basic utilization
- Route assignment

### Simulation

The game can simulate airline operations.

Minimum requirements:

- Manual time advancement
- Operations catch-up
- Passenger revenue
- Operating costs
- Lease or ownership costs
- Aircraft usage
- Aircraft condition changes
- Route performance
- Cash updates
- Simulation report

### Operations Catch-Up

Version 1.0 must include operations catch-up.

Catch-up should:

- Simulate stable existing schedules
- Earn money
- Apply costs
- Progress active operational objectives
- Progress active contracts
- Generate a catch-up report
- Stop for blocking events

Catch-up should not advance major story decisions automatically.

### Progression

Version 1.0 should include career objectives, contracts, and milestones.

Minimum requirements:

- Career objectives for Acts 1 through 3
- Optional challenge contracts
- First partner contract
- Rewards and unlocks
- Story progression controlled by active play

### Partner System

Version 1.0 should include the first partner airline opportunity.

Minimum requirements:

- Fictional partner airline
- Partner offer
- Partner contract
- Reliability requirement
- Partner route or route set
- Partner reward
- Partner restrictions
- Contract completion
- Basic aircraft ownership/control rules for partner flying

### Finance

Version 1.0 should include enough business pressure to matter.

Minimum requirements:

- Cash balance
- Passenger revenue
- Fuel/operating cost approximation
- Aircraft lease/payment cost
- Maintenance cost
- Basic staff or overhead cost
- Profit/loss reporting

### Save and Load

Version 1.0 should support persistent saves.

Minimum requirements:

- Save current airline state
- Save routes
- Save aircraft
- Save schedules
- Save progression state
- Save last simulated time for catch-up

### User Interface

The UI should be simulator-focused.

Minimum required screens:

- Airline dashboard
- Ops map or route view
- Schedule board
- Fleet view
- Career/objectives view
- Contracts view
- Finance view
- Operations report/catch-up report

The UI should avoid generic card-heavy design unless a card is clearly the best representation for the information.

### Inbox

Version 1.0 should include a basic inbox system.

The inbox is used for:

- Story messages
- Co-founder/advisor guidance
- Contract offers
- Operational updates
- Finance warnings
- Feature unlocks
- Partner communications

The inbox should keep story integrated with the simulator interface.

It should avoid long dialogue sequences and should not interrupt the player constantly.

## Not Required for Version 1.0

The following are future branch features and should not be built unless explicitly moved into scope:

- Full independence breakaway arc
- National airline expansion
- International routes
- Widebody aircraft
- Alliances
- Airport expansion projects
- Cargo systems
- Real weather disruption
- Complex competitor AI
- Subsidiary airlines
- Advanced cabin configuration
- Detailed crew management
- Stock market or public company systems
- Multiplayer
- Deep manufacturer relationship systems
- Full partner contract negotiation

## Version 1.0 Success Criteria

Version 1.0 succeeds if the player can:

- Start a tiny airline
- Operate one small aircraft
- Open early routes
- Build schedules
- Earn and lose money through simulation
- Progress while away through operations catch-up
- Complete career objectives
- Take optional contracts
- Grow into scheduled commuter service
- Receive and complete a regional partner contract
- Understand what to do next without being forced down one rigid path

Version 1.0 should feel like the first real chapter of a larger airline career, not a throwaway prototype.
