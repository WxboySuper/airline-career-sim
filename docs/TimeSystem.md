# Time System

The game uses a persistent simulated clock.

Each save has a fixed simulation pace chosen when the airline is created. This pace controls the relationship between real time and in-game time.

The player can pause the simulation to make decisions, review reports, adjust schedules, accept contracts, buy aircraft, or handle story choices.

When the simulation is unpaused, time advances at the save’s selected pace.

The game should not include free always-available speed-up controls. Constant speed controls would weaken the long-form progression and reduce the value of planning, waiting, and stable operations.

Limited time boosts may exist later as earned or scenario-specific mechanics, but they should not be part of the default time system.

## Core Rules

- Time pace is selected at save creation.
- The player may pause and resume.
- The player may not freely change speed during normal play.
- Major story decisions pause time.
- Blocking events pause time.
- Operations catch-up uses the selected save pace.
- Difficulty and simulation pace are separate settings.

## Why This Matters

The game is meant to feel like a long-form airline career.

Waiting is part of the game’s pacing. The player should feel the difference between running one aircraft, building a stable schedule, saving money, and preparing for the next expansion.

The goal is not to let the player instantly skip every slow period. The goal is to make stable operations meaningful while allowing the player to pause when decisions are needed.

## Pause Conditions

The game should automatically pause or stop progress when important player input is needed.

Examples:

- Major story decision becomes available
- Strategic decision is triggered
- Aircraft is grounded
- Schedule becomes invalid
- Cash reaches emergency threshold
- Contract fails or requires action
- Certification application is ready
- Partner offer is received
- Catch-up reaches a blocking event

## Operations Catch-Up

Operations catch-up is the offline form of the time system.

When the player returns, the game calculates how much in-game time should have passed based on the save’s selected pace and the time since the last simulation update.

Catch-up simulates stable scheduled operations, earns revenue, applies costs, updates aircraft condition, progresses active contracts, and generates a report.

Catch-up does not trigger major story decisions automatically.
