# UI

The interface should feel like a game built around airline operations, not a traditional dashboard.

The player should feel like they are managing a living airline world through a custom game interface. The UI should support the serious simulator tone while still feeling like an intentional game experience.

The map, schedule, fleet, contracts, inbox, and reports are not separate admin pages. They are the tools the player uses to shape their airline’s story.

## Core UI Identity

The UI should feel like:

- An airline operations center
- A route planning table
- A dispatch board
- A management sim
- An open-world game map
- A story-driven career interface

The UI should not feel like:

- A SaaS analytics dashboard
- A generic admin panel
- A mobile idle game
- A spreadsheet with airplane icons
- A visual novel interface
- A card-heavy template app

The game is serious, but it should still feel like a game.

## Design Philosophy

The interface should be simulator-first, game-shaped, and story-aware.

The simulator systems are the foundation. Story is layered through inbox messages, objectives, contracts, reports, and strategic decisions.

The player should always understand:

- What is happening
- Why it is happening
- What they can do next
- What risks they are carrying
- What they are currently tracking
- What is optional
- What is blocked by progression

The UI should help the player make decisions without removing the challenge of understanding the airline.

## Large-Screen First

The core game is designed for large screens.

The primary experience should target:

- Desktop browser
- Laptop browser
- Future desktop app packaging

Mobile is not the primary full-game interface.

A future mobile companion may support:

- Airline status monitoring
- Recent reports
- Fleet status
- Route status
- Cash and finance summaries
- Simple alerts
- Catch-up reports
- Limited simple actions

The mobile companion should not initially support:

- Full story progression
- Complex route planning
- Complex schedule editing
- Strategic breakaway decisions
- Full campaign management

## Main Interface Shell

The main game interface should use a full-screen game workspace with floating controls.

Avoid a traditional full-height sidebar.

The UI should feel custom and game-like.

Preferred layout:

- Full-screen active workspace
- Floating top status bar
- Floating command buttons
- Bottom simulation/time strip
- Contextual right-side drawer
- Floating inbox button
- Tracked objective panel
- Modal or panel-based strategic decisions

The shell should make the player feel like they are inside the airline operation, not navigating a website.

## Main Workspace

The main workspace is the largest area of the screen.

It changes based on the active mode, but the default should be the Ops Map.

Primary workspace modes:

- Ops Map
- Schedule Board
- Fleet
- Career
- Inbox
- Contracts
- Finance
- Aircraft Market
- Reports
- Settings

These should feel like game modes or operational tools, not disconnected web pages.

## Floating Top Status Bar

The top status bar should show the airline’s current high-level state.

Possible information:

- Airline name
- Current in-game date and time
- Simulation state: paused or running
- Selected save pace
- Cash
- Reputation or credibility
- Operational reliability
- Active alerts
- Current act or career phase

The top bar should be compact and readable.

It should not become a giant dashboard header.

The top bar answers: “What is the state of my airline right now?”

## Bottom Simulation Strip

The bottom strip controls and explains time.

The game uses a selected simulation pace chosen at save creation. The player can pause and resume, but should not have free always-available speed controls.

The bottom simulation strip may show:

- Pause/resume control
- Current save pace
- Next scheduled flight
- Next expected event
- Current operating period
- Catch-up status
- Upcoming maintenance warning
- Active blocking event, if any

The bottom strip answers: “What is happening next as time moves?”

## Floating Command Buttons

Major tools should be accessed through floating game-style command buttons, not a traditional sidebar.

These buttons may appear as a compact vertical or radial command rail.

Possible command buttons:

- Map
- Schedule
- Fleet
- Career
- Inbox
- Contracts
- Finance
- Market
- Reports
- Settings

The command buttons should:

- Feel custom to the game
- Use clear icons and labels
- Support locked/unlocked states
- Show badges for new items
- Avoid looking like a generic web sidebar

Early in Act 1, some buttons may be hidden or locked until the relevant feature is introduced.

## Locked and Unlocked UI

The UI should support progressive feature unlocking.

The game should not show every system immediately.

During Act 1, the player starts with simplified core tools. More systems unlock as the airline becomes more capable.

Locked features may be:

- Hidden entirely early on
- Visible but disabled
- Marked as locked with a requirement
- Introduced through inbox messages and objectives

The preferred approach is:

- Hide advanced systems before they matter
- Show locked systems when they are close to becoming relevant
- Explain unlock requirements clearly

Feature unlocks should feel like the airline gaining capability, not arbitrary UI restriction.

## Ops Map

The Ops Map is the default world view.

The map is the player’s open world.

Instead of walking through a 3D environment, the player explores by opening routes, entering markets, unlocking airports, signing contracts, and expanding the airline network.

The map should show:

- Airports
- Player routes
- Available routes
- Locked airports
- Contract opportunities
- Home base
- Future hubs
- Route performance
- Airport class
- Airport unlock status
- Selected airport or route details

The map should be visually central to the game’s identity.

## Map Filters

The map needs strong filtering so the player can explore without being overwhelmed.

Map filters should include:

### My Network

Shows only the player’s operated routes, used airports, home base, and active operational footprint.

This is the clean view for understanding the airline as it exists now.

### Available Routes

Shows routes the player can currently open based on aircraft, airport access, certification, route authority, and progression.

This is the expansion planning view.

### Unlocked Airports

Shows airports currently available to the player.

Locked airports may be hidden or dimmed depending on zoom level and filter settings.

### Contracts

Shows airports and routes related to available or active contracts.

This helps contracts feel connected to the world.

### Market Potential

Future planning view for demand, growth, and possible expansion.

This can be introduced later when route planning becomes more advanced.

### Competition

Future view showing competitor presence, market share, and contested routes.

This can be introduced later when competition becomes more important.

### Partner Network

Future view showing partner airline routes, partner-accessible airports, and partner contract opportunities.

This becomes useful during the regional partner era.

## Map Unlock Visibility

The map should support a global filter for progression visibility.

Possible visibility modes:

### My Operation

Only shows the player’s airline network.

### Currently Unlocked

Shows everything the player can currently access.

### Known World

Shows broader geography but dims or locks inaccessible airports.

### Full World

Future optional mode that shows all loaded airports, mostly useful for exploration or sandbox settings.

The player should not be overwhelmed by the full airport database early.

## Contextual Right Drawer

The right-side drawer shows details about the currently selected thing.

It should change based on context.

Selected airport may show:

- Airport name
- ICAO/IATA
- City/region
- Airport class
- Unlock status
- Demand ratings
- Available routes
- Contract opportunities
- Fees
- Restrictions
- Notes

Selected route may show:

- Origin and destination
- Distance
- Demand estimate
- Current fare
- Aircraft suitability
- Schedule status
- Route performance
- Reliability
- Profitability
- Competition
- Related contracts

Selected aircraft may show:

- Aircraft type
- Manufacturer
- Capacity
- Condition
- Cabin condition
- Reliability
- Ownership type
- Payment
- Assigned schedule
- Restrictions
- Maintenance needs

Selected objective or contract may show:

- Requirements
- Progress
- Reward
- Deadline
- Related route or airport
- Track/untrack action

The right drawer should be useful, but not permanently cluttered.

## Tracked Objective System

The game should have a tracked objective mechanic.

The tracked objective is the thing the player has chosen to actively follow.

It may be:

- Main story objective
- Career objective
- Side contract
- Milestone
- Certification requirement
- Maintenance task
- Route challenge
- Partner contract
- Strategic preparation task
- Future event chain

The persistent objective panel should display the tracked objective, not always the main storyline.

This supports open-world progression.

The player may choose to ignore the main story temporarily and track a contract, milestone, or operational goal instead.

## Tracked Objective Panel

The tracked objective panel should be persistent but compact.

It should not replace the full Career or Contracts screens.

It should show:

- Objective title
- Objective type
- Current task
- Progress
- Deadline, if any
- Reward, if relevant
- Risk or penalty, if relevant
- Related action
- Track/untrack state

Example:

Title: Weekend Shuttle Contract  
Type: Private Contract  
Task: Operate 4 round trips before Monday  
Progress: 1 / 4 round trips  
Reward: $18,000  
Action: Open Schedule Board

Example:

Title: Prove Scheduled Reliability  
Type: Career Objective  
Task: Operate 5 days with reliability above 85%  
Progress: 2 / 5 days  
Reward: Commuter certification path  
Action: Open Operations Report

## Tracking Rules

Only one primary objective should be tracked at a time.

The player can change the tracked objective from:

- Career screen
- Contracts screen
- Inbox message
- Map context drawer
- Report screen
- Objective completion screen

Main story objectives can be recommended, but should not always force themselves into the tracked panel.

If no objective is manually tracked, the game may default to the current main story objective.

If the tracked objective is completed, the panel should prompt the player to:

- Claim reward
- View result
- Track next related objective
- Return to current main story objective

## Objective Types

The UI should distinguish objective types clearly.

Possible types:

- Main Story
- Career Objective
- Private Contract
- Partner Contract
- Milestone
- Certification
- Maintenance
- Finance
- Route Goal
- Strategic Decision
- Future Branch

Each type may have a small icon, label, or accent treatment.

The type should be readable without turning the UI into a rainbow checklist.

## Career Screen

The Career screen is the main progression hub.

It should show:

- Current act
- Main story path
- Current career objectives
- Completed objectives
- Unlocked features
- Upcoming unlocks
- Milestones
- Strategic decisions
- Optional preparation goals

The Career screen should show the main story spine without making it feel like the only thing the player can do.

The player should be able to track career objectives from this screen.

## Contracts Screen

The Contracts screen shows available, active, completed, expired, and future contracts.

Contract categories may include:

- Private contracts
- Community contracts
- Business contracts
- Airport contracts
- Partner contracts
- Seasonal contracts
- Future government or subsidy contracts

Each contract should show:

- Client or sender
- Route or airport
- Requirements
- Deadline
- Reward
- Penalty
- Risk level
- Aircraft requirements
- Track button

Contracts should feel like side quests connected to the airline world.

## Inbox

The Inbox is the main story and communication system.

It should deliver:

- Co-founder messages
- Contract offers
- Airport messages
- Finance warnings
- Operational alerts
- Partner communications
- Certification notices
- Feature unlock explanations
- System messages

The inbox should feel like part of the airline operation.

It should not be a throwaway notification list.

## Co-Founder Messages

The co-founder should primarily communicate through the inbox.

Co-founder messages should be full email-style messages, not short floating tips.

The co-founder should not constantly appear as a tooltip or speech bubble.

The co-founder should feel like a practical business partner and advisor.

Known co-founder name:

Maya Reyes

Maya’s tone should be:

- Grounded
- Practical
- Friendly
- Brief but human
- Focused on survival and growth
- Occasionally encouraging
- Not childish
- Not overly comedic
- Not corporate

## Inbox Message Format

Messages may include:

- Sender
- Sender role
- Subject
- Date/time
- Category
- Body
- Related objective
- Related contract
- Related route
- Related aircraft
- Action button
- Reward or unlock information
- Read/unread state
- Archived state

Example sender types:

- Maya Reyes, Co-Founder
- Dispatch
- Maintenance
- Finance
- Airport Office
- Contract Client
- Certification Office
- Partner Airline
- System

## Inbox Message Length

Story and co-founder messages should be long enough to feel meaningful.

They should not be tiny one-line tooltips.

However, they should not become walls of text.

Ideal length:

- 1 to 4 short paragraphs
- Clear subject
- Clear action when relevant
- Optional details collapsed if needed

## Inbox Message Example

Sender: Maya Reyes  
Subject: Keep the first route boring

We need the first route to prove the operation works, not prove we are fearless.

Pick something short, repeatable, and close enough that one delay does not wreck the whole day. If we can move people reliably for a few days, we can start asking for better opportunities.

For now, boring is not bad. Boring is how we survive.

Action: Open Route Planning

## Strategic Decisions

Strategic decisions are major choices that affect the airline’s story or business direction.

They should use dedicated decision panels.

Strategic decisions should pause time.

Examples:

- Apply for Scheduled Commuter status
- Accept a partner airline offer
- Deepen partnership
- Explore independence
- Negotiate breakaway
- Hard break from partner
- Commit to a hub strategy

Decision panels should show:

- Situation summary
- Options
- Pros
- Cons
- Costs
- Risks
- Requirements
- Consequences
- Confirm button
- Delay/decide later option, if appropriate

Strategic decisions should never be hidden inside normal inbox messages without clear action.

## Schedule Board

The Schedule Board is one of the most important simulator screens.

It should feel like an airline operations planning board, not a generic calendar.

The board should show:

- Aircraft rows
- Time across the day
- Flight blocks
- Turn times
- Conflicts
- Ground time
- Maintenance blocks
- Route assignments
- Utilization
- Canceled or invalid segments

Early game may use a simplified schedule board.

Future versions can add more advanced tools.

The Schedule Board should support:

- Assigning aircraft to flights
- Viewing conflicts
- Viewing utilization
- Seeing whether a route can be operated reliably
- Understanding why a schedule is invalid

## Fleet Screen

The Fleet screen should feel like a fleet ledger.

It should show aircraft as operational assets, not collectible cards.

Fleet information may include:

- Aircraft ID
- Type
- Manufacturer
- Category
- Capacity
- Range
- Condition
- Cabin condition
- Reliability
- Ownership type
- Monthly payment
- Assigned base
- Assigned schedule
- Utilization
- Maintenance status
- Contract restrictions
- Partner ownership or financing status

The player should be able to inspect aircraft and understand why one aircraft differs from another.

## Aircraft Market

The Aircraft Market shows available new, used, leased, and partner-connected aircraft.

It should support aircraft comparison without overwhelming the player.

Aircraft market information may include:

- Manufacturer
- Aircraft type
- Category
- Capacity
- Range
- Reliability
- Comfort
- Operating cost
- Acquisition price
- Lease cost
- Used condition
- Delivery time
- Partner compatibility
- Airport suitability
- Financing options

Aircraft should be presented as meaningful business decisions.

The market should avoid making one aircraft an obvious best choice.

## Finance Screen

The Finance screen shows whether the airline is actually surviving.

It should be understandable, but not oversimplified.

Finance information may include:

- Cash balance
- Daily revenue
- Daily expenses
- Route profitability
- Aircraft payments
- Fuel or operating costs
- Maintenance costs
- Staff or overhead costs
- Contract revenue
- Penalties
- Cash runway
- Recent financial events

The Finance screen should create pressure without becoming accounting homework.

## Reports

Reports explain what happened during simulated operations.

Report types may include:

- First flight report
- Daily operations report
- Catch-up report
- Contract report
- Maintenance report
- Incident report
- Financial report
- Objective completion report

Reports should summarize:

- Flights operated
- Passengers carried
- Revenue
- Costs
- Profit or loss
- Reliability
- Aircraft condition changes
- Contract progress
- Objective progress
- Problems
- Warnings
- Next suggested action

Reports should be readable and actionable.

## Alerts and Notifications

Alerts should be separate from story messages.

Alert levels:

### Normal

Inbox message or passive notification.

### Important

Badge, notification, or highlighted alert.

### Blocking

Pauses time and requires player action.

Blocking alerts may include:

- Aircraft grounded
- Cash emergency
- Invalid schedule
- Required strategic decision
- Contract failure
- Certification decision
- Partner offer requiring response

Alerts should not become noise.

## Story Delivery

Story should be delivered through:

- Inbox messages
- Career objectives
- Contract briefings
- Reports
- Strategic decisions

Story should not be delivered through constant popups, floating advisor lines, or long disconnected cutscenes.

The player should feel like the story emerges from operating the airline.

## Game Feel

The UI should use custom game-style presentation.

Prefer:

- Full-screen workspaces
- Floating controls
- Map-first interaction
- Slide-out panels
- Operational boards
- Ledgers
- Timelines
- Reports
- Contextual drawers
- Badges and unlock states

Avoid:

- Traditional full-height sidebars
- Generic card grids
- SaaS dashboard layouts
- Excessive charts early
- Constant tutorial bubbles
- Overly playful toy-like UI

## Visual Direction

The visual style should be serious and modern, but not sterile.

Possible visual traits:

- Dark operations-room base
- Aviation map lines
- Clean typography
- Compact status indicators
- Subtle glow or contrast on active routes
- High clarity panels
- Strong hierarchy
- Route and airport visual emphasis
- Minimal decorative clutter

The UI should feel designed for a game about airline operations.

## Progressive Complexity

The UI should grow with the airline.

Act 1 starts with simplified tools.

Later acts unlock more:

- More map filters
- More route analytics
- More finance depth
- More aircraft market detail
- Partner tools
- Hub tools
- Competition views
- Advanced scheduling
- Strategic decision panels

Progressive complexity is essential.

The player should learn the game by growing the airline.

## Version 1.0 UI Scope

Version 1.0 should include:

- Main game shell
- Ops Map
- Map filters for My Network and available/unlocked routes
- Floating command buttons
- Top status bar
- Bottom simulation strip
- Tracked objective panel
- Contextual drawer
- Inbox
- Career screen
- Contracts screen
- Schedule Board
- Fleet screen
- Aircraft Market
- Finance screen
- Reports
- Locked/unlocked feature states

Version 1.0 does not need:

- Mobile companion UI
- Full hub tools
- Advanced competition view
- International route UI
- Airport expansion UI
- Alliance UI
- Subsidiary management UI
- Deep cabin configuration UI

## Mockup Priorities

Initial visual references should focus on:

1. Main Ops Map with floating game HUD controls
2. Schedule Board
3. Inbox with full co-founder email
4. Career and tracked objective interaction
5. Aircraft Market comparison
6. Catch-up report

The first mockup should establish the main interface identity.

It should show:

- Full-screen map
- Floating top status bar
- Floating command buttons
- Bottom simulation strip
- Tracked objective panel
- Inbox badge
- Contextual drawer
- No traditional sidebar
- No generic SaaS card grid

## Reference Images

Initial UI reference images are stored in `docs/UI_Reference`.

These images are directional references, not exact implementation targets. They are used to capture layout, mood, hierarchy, and game-feel.
