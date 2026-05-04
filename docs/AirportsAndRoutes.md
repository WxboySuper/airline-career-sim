# Airports and Routes

The game uses real airport locations and airport codes, but fictional airlines and aircraft.

The raw airport database is stored in `data/airports.json`.

The raw data includes fields such as ICAO, IATA, airport name, city, state, country, elevation, latitude, longitude, and timezone.

The raw airport file should not be treated as fully gameplay-ready. It includes many tiny private fields, airstrips, and airports that may not fit normal airline gameplay without classification or filtering.

The game should use a curated or generated gameplay airport layer built from the raw data.

## Airport Design Goals

Airports should:

- Give the player a real geographic world to build within
- Support progression from tiny fields to larger airports
- Shape route opportunities
- Limit certain aircraft or operations by airport class
- Create future constraints through gates, slots, fees, and capacity
- Support hubs and connecting demand
- Allow future expansion into airport partnerships and airport development/growth

## Airport Classes

### Airstrip / Local Field

Tiny airports and private fields.

These may support founder-scale operations, special contracts, or tiny aircraft, but they are not suitable for long-term airline growth without future expansion mechanics.

Typical use:

- Founder operations
- Very small aircraft
- Special contracts
- Remote or rural service

### Community Airport

Small public airports that can support basic commuter service.

Typical use:

- Early scheduled routes
- Small commuter aircraft
- Thin local demand
- Low fees
- Low competition

### Regional Airport

Airports that can support meaningful regional airline operations.

Typical use:

- Scheduled commuter service
- Regional routes
- Early hubs
- Partner feeder operations
- Larger turboprops and regional jets

### Commercial Airport

Airports with stronger passenger demand and more serious airline activity.

Typical use:

- Larger regional operations
- Early mainline-style service
- Stronger competition
- Higher fees
- More route opportunities

### Major Airport

Large airports with strong demand and stronger competition.

Typical use:

- Major route opportunities
- Hub development
- Partner airline activity
- Slot or gate pressure
- Larger aircraft

### Global Gateway

Major international airports.

These are future-focused for long-haul, alliances, global partnerships, premium demand, and heavy competition.

Typical use:

- International service
- Long-haul networks
- Alliances
- Premium passengers
- Heavy slot constraints

## Gameplay Airport Fields

The curated airport layer should add gameplay fields such as:

- Airport class
- Starting airport eligibility
- Local demand rating
- Business demand rating
- Leisure demand rating
- Hub potential
- Gate capacity
- Slot pressure
- Fee level
- Commercial viability
- Runway class
- Partner airline presence
- Competitor presence
- Region
- Market group
- Notes or manual overrides

## Starting Airports

Starting airports should be limited to airports that fit the founder story.

They should generally be smaller airports where one tiny aircraft makes sense.

A good starting airport should:

- Have enough demand to support early operations
- Not be so large that the player feels like a fake major airline immediately
- Have nearby route opportunities
- Allow growth into commuter operations
- Eventually push the player toward larger regional airports

The player may start at a small airport and eventually outgrow it.

Outgrowing airports is part of progression.

## Airport Progression

The player should not have immediate practical access to every airport type.

Airport access should expand as the airline gains:

- Certification
- Reputation
- Cash stability
- Aircraft capability
- Partner relationships
- Operational trust
- Route authority
- Story progression

This helps the player learn airline growth in layers.

## Future Airport Expansion

Airport expansion is a future branch feature.

Eventually, the player may be able to partner with airports to expand gates, improve facilities, reduce fees, or turn a smaller airport into a larger operation.

This should not be part of the earliest vertical trunk unless explicitly added later.

Possible future airport partnership projects:

- Add gates
- Renovate terminal areas
- Build a maintenance base
- Create a regional concourse
- Commit to minimum service levels
- Receive fee discounts
- Receive route incentives
- Gain exclusive gate rights

## Route Design Goals

Routes should not be simple demand bars.

A route should be a market with passenger behavior, operational constraints, competition, and strategic fit.

Routes should consider:

- Origin airport
- Destination airport
- Distance
- Aircraft suitability
- Passenger demand
- Fare
- Frequency
- Schedule quality
- Airline reputation
- Competition
- Airport class
- Hub connectivity
- Operating cost

## Passenger Demand

Demand should be split into types over time.

Early versions may use simpler demand, but the design should support future expansion.

Passenger demand types may include:

- Local leisure passengers
- Local business passengers
- Connecting leisure passengers
- Connecting business passengers
- Price-sensitive passengers
- Schedule-sensitive passengers
- Reputation-sensitive passengers

## Hubs and Connecting Demand

Hubs should matter.

An airport should not behave the same whether it is a simple destination or a real hub.

A hub creates value by allowing passengers to connect between routes.

Connecting demand should require:

- A viable origin route
- A viable destination route
- A valid connection time
- Reasonable total travel time
- Competitive fare
- Acceptable airline reputation
- Acceptable schedule quality

Hub demand should not be magic. It should come from the network the player built.

## Route Competition

Competition should eventually make routes feel alive.

Competitors may affect:

- Market share
- Fares
- Passenger choice
- Frequency expectations
- Route profitability
- Hub pressure
- Strategic risk

Early versions may use simple competitor presence. Deeper competitor AI can be added later.

## Route Strategic Lessons

Tiny routes teach survival.

Short commuter routes teach frequency and reliability.

Regional routes teach aircraft fit and scheduled operations.

Partner routes teach contract compliance.

Hub routes teach connection timing.

Competitive routes teach market share.

Future national and international routes teach scale, slots, premium demand, and risk.
