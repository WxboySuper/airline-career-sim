# Operations Catch-Up

Operations Catch-Up allows the airline to continue stable scheduled operations while the player is away.

It helps the game feel like a living simulator without forcing the player to be constantly active.

## Core Rule

Catch-up runs operations, not story.

The airline may keep flying, earning money, paying costs, wearing aircraft, and progressing active operational commitments. Major story decisions wait for the player.

## Why Catch-Up Exists

This game is long-form. The player should not need to manually click through every single day forever.

Catch-up allows the player to:

- Earn money from stable operations
- See the results of their planning
- Return to meaningful progress
- Maintain the feeling of a living airline
- Resume story progression when ready

## What Catch-Up Can Do

Catch-up may:

- Run existing scheduled flights
- Earn passenger revenue
- Apply fuel costs
- Apply staff costs
- Apply facility costs
- Apply lease or loan payments
- Apply maintenance costs
- Progress active contracts
- Progress active operational objectives
- Reduce aircraft condition
- Update route performance history
- Generate an operations report

## What Catch-Up Cannot Do

Catch-up must not:

- Trigger major story decisions automatically
- Accept contracts automatically
- Buy aircraft automatically
- Lease aircraft automatically
- Sell aircraft automatically
- Open routes automatically
- Change routes automatically
- Close routes automatically
- Change schedules automatically
- Force breakaway decisions
- Choose strategic options
- Make irreversible business decisions without the player

## Blocking Events

Catch-up should stop early if a major problem or decision appears.

Examples:

- Cash falls below emergency threshold
- Aircraft becomes grounded
- Required maintenance blocks scheduled service
- A contract fails
- A schedule becomes invalid
- The airline reaches a configured catch-up cap

When catch-up stops early, the player should receive a clear report explaining why.

## Time Conversion

The game may support multiple pace settings.

Examples:

- Manual: no offline catch-up
- Slow: slower real-time to game-time conversion
- Standard: default real-time to game-time conversion
- Fast: faster real-time to game-time conversion

Difficulty and pace should be separate settings.

A hard game can still be slow. A casual game can still be fast.

## Catch-Up Reports

After catch-up, the player should receive a report summarizing what happened.

The report should include:

- Simulated days completed
- Flights operated
- Passengers carried
- Revenue earned
- Costs paid
- Net profit or loss
- Reliability
- Aircraft condition changes
- Contract progress
- Objective progress
- Problems encountered
- Reason catch-up stopped, if applicable

## Implementation Rule

Manual time advancement and catch-up should use the same simulation engine.

Manual advance should be equivalent to simulating a small number of days while the player is active.

Catch-up should call the same simulation logic for multiple days while respecting catch-up-specific stopping rules.

The simulation should be deterministic where practical.

## Relationship to Time Pace

Each save has a selected simulation pace.

Operations catch-up uses that pace to determine how much in-game time has passed while the player was away.

Catch-up should not use a separate unrelated time conversion unless a scenario or special rule explicitly overrides it.
