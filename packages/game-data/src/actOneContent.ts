import {
  actMetadataSchema,
  careerObjectiveSchema,
  contractSchema,
  featureUnlockSchema,
  inboxMessageSchema,
  type CareerObjective,
  type ObjectiveId
} from "@airline-career-sim/shared";

export const ACT_ONE_ID = "act1";
export const ACT_ONE_DEFAULT_TRACKED_OBJECTIVE_ID = "objective:choose-first-route" as ObjectiveId;

export const actOneFeatureUnlocks = [
  {
    id: "unlock:basic-dashboard",
    name: "Basic Dashboard",
    description: "Shows the fragile operating picture for a new founder airline.",
    actId: ACT_ONE_ID,
    category: "workspace",
    initiallyAvailable: true,
    unlockOrder: 0
  },
  {
    id: "unlock:inbox",
    name: "Inbox",
    description: "Receives co-founder guidance, operational notices, and early opportunities.",
    actId: ACT_ONE_ID,
    category: "workspace",
    initiallyAvailable: true,
    unlockOrder: 1
  },
  {
    id: "unlock:simplified-route-planning",
    name: "Simplified Route Planning",
    description: "Allows one short founder route from the home airport.",
    actId: ACT_ONE_ID,
    category: "operations",
    initiallyAvailable: true,
    unlockOrder: 2
  },
  {
    id: "unlock:simplified-schedule-board",
    name: "Simplified Schedule Board",
    description: "Builds a simple one-aircraft schedule before deeper schedule tools unlock.",
    actId: ACT_ONE_ID,
    category: "operations",
    initiallyAvailable: true,
    unlockOrder: 3
  },
  {
    id: "unlock:pause-resume-controls",
    name: "Pause and Resume Controls",
    description: "Runs the clock at the selected save pace and pauses for player decisions.",
    actId: ACT_ONE_ID,
    category: "operations",
    initiallyAvailable: true,
    unlockOrder: 4
  },
  {
    id: "unlock:operations-report",
    name: "Operations Report",
    description: "Reviews completed operating periods before the airline expands.",
    actId: ACT_ONE_ID,
    category: "operations",
    unlockOrder: 5,
    sourceObjectiveId: "objective:run-first-operating-period"
  },
  {
    id: "unlock:reliability-tracking",
    name: "Reliability Tracking",
    description: "Tracks whether the schedule is dependable enough to earn credibility.",
    actId: ACT_ONE_ID,
    category: "operations",
    unlockOrder: 6,
    sourceObjectiveId: "objective:review-first-report"
  },
  {
    id: "unlock:operations-catch-up",
    name: "Operations Catch-Up",
    description: "Runs stable scheduled operations while the player is away.",
    actId: ACT_ONE_ID,
    category: "operations",
    unlockOrder: 7,
    sourceObjectiveId: "objective:make-it-repeatable"
  },
  {
    id: "unlock:private-contracts",
    name: "Private Contracts",
    description: "Adds small optional work that helps the founder airline survive.",
    actId: ACT_ONE_ID,
    category: "contracts",
    unlockOrder: 8,
    sourceObjectiveId: "objective:let-schedule-run"
  },
  {
    id: "unlock:business-finance-view",
    name: "Business and Finance View",
    description: "Shows revenue, expenses, cash pressure, and short-term survival risk.",
    actId: ACT_ONE_ID,
    category: "finance",
    unlockOrder: 9,
    sourceObjectiveId: "objective:take-work-where-you-can-get-it"
  },
  {
    id: "unlock:maintenance-view",
    name: "Aircraft Condition and Maintenance View",
    description: "Shows aircraft condition, reliability pressure, and maintenance needs.",
    actId: ACT_ONE_ID,
    category: "maintenance",
    unlockOrder: 10,
    sourceObjectiveId: "objective:watch-the-numbers"
  },
  {
    id: "unlock:expanded-route-planning",
    name: "Expanded Route Planning",
    description: "Adds enough route detail to compare a second small scheduled market.",
    actId: ACT_ONE_ID,
    category: "operations",
    unlockOrder: 11,
    sourceObjectiveId: "objective:keep-aircraft-healthy"
  },
  {
    id: "unlock:second-route-permission",
    name: "Second Route Permission",
    description: "Allows the founder airline to prove reliability across one or two routes.",
    actId: ACT_ONE_ID,
    category: "progression",
    unlockOrder: 12,
    sourceObjectiveId: "objective:keep-aircraft-healthy"
  },
  {
    id: "unlock:commuter-certification-path",
    name: "Commuter Certification Path",
    description: "Opens the decision to apply for Scheduled Commuter status.",
    actId: ACT_ONE_ID,
    category: "progression",
    unlockOrder: 13,
    sourceObjectiveId: "objective:prove-scheduled-reliability"
  }
] as const;

export const actOneMetadata = {
  id: ACT_ONE_ID,
  displayName: "Founder Operator",
  shortDescription: "Prove a one-aircraft airline can operate safely and repeatedly.",
  longDescription:
    "The airline begins as a fragile founder-run service with one small aircraft, limited cash, and almost no credibility. Act 1 introduces route choice, scheduling, reports, catch-up, private contracts, finance pressure, maintenance, and reliability one layer at a time.",
  startingFeatureUnlockIds: [
    "unlock:basic-dashboard",
    "unlock:inbox",
    "unlock:simplified-route-planning",
    "unlock:simplified-schedule-board",
    "unlock:pause-resume-controls"
  ],
  completionCriteriaSummary:
    "Operate a repeatable small schedule, review the numbers, keep the aircraft healthy, and prove enough reliability to apply for Scheduled Commuter status.",
  transitionTarget: {
    actId: "act2",
    displayName: "Scheduled Commuter"
  }
} as const;

const objectiveIds = [
  "objective:choose-first-route",
  "objective:build-first-schedule",
  "objective:run-first-operating-period",
  "objective:review-first-report",
  "objective:make-it-repeatable",
  "objective:let-schedule-run",
  "objective:take-work-where-you-can-get-it",
  "objective:watch-the-numbers",
  "objective:keep-aircraft-healthy",
  "objective:prove-scheduled-reliability",
  "objective:apply-for-scheduled-commuter-status"
] as const;

/**
 * Helper to build a consistent objective requirement placeholder.
 *
 * @param id - Unique requirement ID.
 * @param type - The category of requirement (e.g., 'choose-route').
 * @param description - Human-readable requirement text.
 * @param targetValue - Optional target numeric value for the requirement.
 * @returns A requirement data object.
 */
const placeholderRequirement = (
  id: string,
  type: CareerObjective["requirements"][number]["type"],
  description: string,
  targetValue?: number
) => ({
  id,
  type,
  description,
  targetValue
});

export const actOneObjectives = [
  {
    id: objectiveIds[0],
    title: "Choose the First Route",
    description: "Pick one short, practical route from the home airport.",
    actId: ACT_ONE_ID,
    order: 1,
    objectiveType: "main-story",
    phase: "founder-operator",
    requirements: [
      placeholderRequirement(
        "select-eligible-founder-route",
        "choose-route",
        "Select one eligible founder route from the starting airport.",
        1
      )
    ],
    rewards: { unlockIds: [], nextObjectiveIds: [objectiveIds[1]] },
    relatedFeatureUnlockIds: ["unlock:simplified-route-planning"],
    relatedInboxMessageIds: ["message:maya-welcome-setup", "message:maya-first-route-guidance"],
    trackable: true,
    completionSummary: "The airline has its first market to prove.",
    nextObjectiveId: objectiveIds[1],
    milestoneIds: [],
    visible: true
  },
  {
    id: objectiveIds[1],
    title: "Build the First Schedule",
    description: "Turn the first route into a simple one-aircraft schedule.",
    actId: ACT_ONE_ID,
    order: 2,
    objectiveType: "main-story",
    phase: "founder-operator",
    requirements: [
      placeholderRequirement(
        "schedule-one-round-trip",
        "build-schedule",
        "Create at least one round trip with valid turn time.",
        1
      )
    ],
    rewards: { unlockIds: [], nextObjectiveIds: [objectiveIds[2]] },
    relatedFeatureUnlockIds: ["unlock:simplified-schedule-board"],
    relatedInboxMessageIds: ["message:maya-first-schedule-guidance"],
    trackable: true,
    completionSummary: "The first schedule is ready for the clock.",
    nextObjectiveId: objectiveIds[2],
    milestoneIds: [],
    visible: true
  },
  {
    id: objectiveIds[2],
    title: "Run the First Operating Period",
    description: "Resume the clock and let the first scheduled operation complete.",
    actId: ACT_ONE_ID,
    order: 3,
    objectiveType: "main-story",
    phase: "founder-operator",
    requirements: [
      placeholderRequirement(
        "complete-first-operating-period",
        "run-operating-period",
        "Run the scheduled operation through its first completed period.",
        1
      )
    ],
    rewards: { unlockIds: ["unlock:operations-report"], nextObjectiveIds: [objectiveIds[3]] },
    relatedFeatureUnlockIds: ["unlock:pause-resume-controls", "unlock:operations-report"],
    relatedInboxMessageIds: ["message:dispatch-first-report-ready"],
    trackable: true,
    completionSummary: "The first operating period is complete.",
    nextObjectiveId: objectiveIds[3],
    milestoneIds: [],
    visible: true
  },
  {
    id: objectiveIds[3],
    title: "Review the First Report",
    description: "Read the operations report before adding complexity.",
    actId: ACT_ONE_ID,
    order: 4,
    objectiveType: "main-story",
    phase: "founder-operator",
    requirements: [
      placeholderRequirement(
        "review-first-operations-report",
        "review-report",
        "Open and acknowledge the first operations report.",
        1
      )
    ],
    rewards: { unlockIds: ["unlock:reliability-tracking"], nextObjectiveIds: [objectiveIds[4]] },
    relatedFeatureUnlockIds: ["unlock:operations-report", "unlock:reliability-tracking"],
    relatedInboxMessageIds: ["message:maya-first-report-guidance"],
    trackable: true,
    completionSummary: "The airline can now measure reliability.",
    nextObjectiveId: objectiveIds[4],
    milestoneIds: [],
    visible: true
  },
  {
    id: objectiveIds[4],
    title: "Make It Repeatable",
    description: "Operate the same small schedule for several days without cancellations.",
    actId: ACT_ONE_ID,
    order: 5,
    objectiveType: "main-story",
    phase: "founder-operator",
    requirements: [
      placeholderRequirement(
        "operate-clean-repeatable-days",
        "maintain-reliability",
        "Operate three scheduled days with no canceled flights.",
        3
      )
    ],
    rewards: { unlockIds: ["unlock:operations-catch-up"], nextObjectiveIds: [objectiveIds[5]] },
    relatedFeatureUnlockIds: ["unlock:reliability-tracking", "unlock:operations-catch-up"],
    relatedInboxMessageIds: ["message:maya-catch-up-unlock"],
    trackable: true,
    completionSummary: "The schedule is stable enough for catch-up.",
    nextObjectiveId: objectiveIds[5],
    milestoneIds: [],
    visible: true
  },
  {
    id: objectiveIds[5],
    title: "Let the Schedule Run",
    description: "Use catch-up or continued simulation to prove stable operations while away.",
    actId: ACT_ONE_ID,
    order: 6,
    objectiveType: "main-story",
    phase: "founder-operator",
    requirements: [
      placeholderRequirement(
        "use-or-complete-catch-up-period",
        "use-catch-up",
        "Run a stable schedule across a catch-up or multi-day simulation period.",
        1
      )
    ],
    rewards: { unlockIds: ["unlock:private-contracts"], nextObjectiveIds: [objectiveIds[6]] },
    relatedFeatureUnlockIds: ["unlock:operations-catch-up", "unlock:private-contracts"],
    relatedInboxMessageIds: [
      "message:maya-private-contracts-intro",
      "message:contract-board-private-contracts-open"
    ],
    trackable: true,
    completionSummary: "Private work is now available.",
    nextObjectiveId: objectiveIds[6],
    milestoneIds: [],
    visible: true
  },
  {
    id: objectiveIds[6],
    title: "Take Work Where You Can Get It",
    description: "Accept and complete one small private contract.",
    actId: ACT_ONE_ID,
    order: 7,
    objectiveType: "main-story",
    phase: "founder-operator",
    requirements: [
      placeholderRequirement(
        "complete-one-private-contract",
        "complete-contract",
        "Complete one early private contract.",
        1
      )
    ],
    rewards: { unlockIds: ["unlock:business-finance-view"], nextObjectiveIds: [objectiveIds[7]] },
    relatedFeatureUnlockIds: ["unlock:private-contracts", "unlock:business-finance-view"],
    relatedInboxMessageIds: ["message:maya-finance-view-intro"],
    trackable: true,
    completionSummary: "The airline has earned outside work and needs to watch cash.",
    nextObjectiveId: objectiveIds[7],
    milestoneIds: [],
    visible: true
  },
  {
    id: objectiveIds[7],
    title: "Watch the Numbers",
    description: "Review revenue, expenses, and cash pressure before expanding.",
    actId: ACT_ONE_ID,
    order: 8,
    objectiveType: "finance",
    phase: "founder-operator",
    requirements: [
      placeholderRequirement(
        "review-business-finance-view",
        "review-finance",
        "Open the business and finance view and acknowledge cash flow.",
        1
      )
    ],
    rewards: { unlockIds: ["unlock:maintenance-view"], nextObjectiveIds: [objectiveIds[8]] },
    relatedFeatureUnlockIds: ["unlock:business-finance-view", "unlock:maintenance-view"],
    relatedInboxMessageIds: ["message:maya-maintenance-intro"],
    trackable: true,
    completionSummary: "The maintenance view is now relevant to survival.",
    nextObjectiveId: objectiveIds[8],
    milestoneIds: [],
    visible: true
  },
  {
    id: objectiveIds[8],
    title: "Keep the Aircraft Healthy",
    description: "Review aircraft condition and acknowledge maintenance needs.",
    actId: ACT_ONE_ID,
    order: 9,
    objectiveType: "maintenance",
    phase: "founder-operator",
    requirements: [
      placeholderRequirement(
        "review-aircraft-condition",
        "review-maintenance",
        "Inspect the starter aircraft condition and maintenance state.",
        1
      )
    ],
    rewards: {
      unlockIds: ["unlock:expanded-route-planning", "unlock:second-route-permission"],
      nextObjectiveIds: [objectiveIds[9]]
    },
    relatedFeatureUnlockIds: [
      "unlock:maintenance-view",
      "unlock:expanded-route-planning",
      "unlock:second-route-permission"
    ],
    relatedInboxMessageIds: ["message:maya-reliability-certification"],
    trackable: true,
    completionSummary: "The airline may prepare for a second small route.",
    nextObjectiveId: objectiveIds[9],
    milestoneIds: [],
    visible: true
  },
  {
    id: objectiveIds[9],
    title: "Prove Scheduled Reliability",
    description:
      "Operate a small one- or two-route schedule while meeting reliability and cash targets.",
    actId: ACT_ONE_ID,
    order: 10,
    objectiveType: "main-story",
    phase: "founder-operator",
    requirements: [
      placeholderRequirement(
        "operate-reliable-scheduled-service",
        "maintain-reliability",
        "Operate five scheduled days at or above the reliability target.",
        5
      ),
      placeholderRequirement(
        "retain-positive-cash",
        "reach-cash-reserve",
        "Keep enough cash on hand to qualify for commuter review.",
        1
      )
    ],
    rewards: {
      unlockIds: ["unlock:commuter-certification-path"],
      nextObjectiveIds: [objectiveIds[10]]
    },
    relatedFeatureUnlockIds: [
      "unlock:expanded-route-planning",
      "unlock:second-route-permission",
      "unlock:commuter-certification-path"
    ],
    relatedInboxMessageIds: [
      "message:maya-reliability-certification",
      "message:certification-office-path-open"
    ],
    trackable: true,
    completionSummary: "Scheduled Commuter certification is available.",
    nextObjectiveId: objectiveIds[10],
    milestoneIds: [],
    visible: true
  },
  {
    id: objectiveIds[10],
    title: "Apply for Scheduled Commuter Status",
    description: "Choose whether to stay in Act 1 or apply for Scheduled Commuter status.",
    actId: ACT_ONE_ID,
    order: 11,
    objectiveType: "certification",
    phase: "founder-operator",
    requirements: [
      placeholderRequirement(
        "apply-for-scheduled-commuter-status",
        "apply-for-certification",
        "Open the certification path and choose when to apply.",
        1
      )
    ],
    rewards: { unlockIds: [], nextObjectiveIds: [] },
    relatedFeatureUnlockIds: ["unlock:commuter-certification-path"],
    relatedInboxMessageIds: ["message:maya-act2-application-guidance"],
    trackable: true,
    completionSummary: "The airline is ready to transition toward Scheduled Commuter operations.",
    milestoneIds: [],
    visible: true
  }
] as const;

export const actOneInboxMessages = [
  {
    id: "message:maya-welcome-setup",
    sender: "Maya Reyes",
    senderRole: "co-founder",
    subject: "We are open, but keep it simple",
    body: "The airline exists now. That is the good news.\n\nThe harder part is proving we can operate one aircraft without turning every day into a rescue mission. Start with the tools in front of us: one route, one schedule, and a close look at every report.\n\nKeep the first move boring enough to survive. We can get ambitious after the operation shows a pulse.",
    category: "story",
    createdAt: "2026-05-04T08:01:00.000-05:00",
    read: false,
    archived: false,
    relatedObjectiveId: "objective:choose-first-route",
    storyTags: ["act1", "setup", "maya"],
    actionTarget: { type: "view-objective", targetId: "objective:choose-first-route" },
    trigger: "new-act1-save"
  },
  {
    id: "message:maya-first-route-guidance",
    sender: "Maya Reyes",
    senderRole: "co-founder",
    subject: "Pick the route that lets us come home",
    body: "For the first route, distance is risk. A short market gives us more chances to recover if the airplane runs late or the bookings are softer than expected.\n\nChoose something close, repeatable, and useful to the community. We are not trying to impress anyone yet. We are trying to be there tomorrow.",
    category: "story",
    createdAt: "2026-05-04T08:05:00.000-05:00",
    read: false,
    archived: false,
    relatedObjectiveId: "objective:choose-first-route",
    storyTags: ["act1", "route-planning", "maya"],
    actionTarget: { type: "open-route-planning" },
    rewardUnlockId: "unlock:simplified-route-planning",
    trigger: "objective:choose-first-route-active"
  },
  {
    id: "message:maya-first-schedule-guidance",
    sender: "Maya Reyes",
    senderRole: "co-founder",
    subject: "Leave room in the day",
    body: "The first schedule should have breathing room. One aircraft has no backup, and the cheapest delay is the one we planned around.\n\nBuild a round trip we can actually fly, with enough turn time to clean up small mistakes. A schedule that survives the first week is more valuable than a schedule that looks perfect on paper.",
    category: "story",
    createdAt: "2026-05-04T08:08:00.000-05:00",
    read: false,
    archived: false,
    relatedObjectiveId: "objective:build-first-schedule",
    storyTags: ["act1", "schedule", "maya"],
    actionTarget: { type: "open-schedule-board" },
    rewardUnlockId: "unlock:simplified-schedule-board",
    trigger: "objective:build-first-schedule-active"
  },
  {
    id: "message:maya-first-report-guidance",
    sender: "Maya Reyes",
    senderRole: "co-founder",
    subject: "Read the report before chasing growth",
    body: "The first report is not a grade. It is the first honest look at what the airline can handle.\n\nCheck what the flight earned, what it cost, and whether the operation stayed reliable. If the numbers are ugly, good. Better to learn that with one route than with a network we cannot afford.",
    category: "story",
    createdAt: "2026-05-04T08:14:00.000-05:00",
    read: false,
    archived: false,
    relatedObjectiveId: "objective:review-first-report",
    storyTags: ["act1", "reports", "maya"],
    actionTarget: { type: "view-report" },
    rewardUnlockId: "unlock:operations-report",
    trigger: "unlock:operations-report"
  },
  {
    id: "message:maya-catch-up-unlock",
    sender: "Maya Reyes",
    senderRole: "co-founder",
    subject: "Stable schedules can run while we are away",
    body: "We have enough repeatability now to let the operation keep moving between check-ins.\n\nCatch-up should only run stable scheduled flying. It can earn revenue, apply costs, and show us what happened, but it should not make big decisions for us. If something needs judgment, the clock waits.",
    category: "story",
    createdAt: "2026-05-04T08:18:00.000-05:00",
    read: false,
    archived: false,
    relatedObjectiveId: "objective:make-it-repeatable",
    storyTags: ["act1", "catch-up", "maya"],
    actionTarget: { type: "view-objective", targetId: "objective:let-schedule-run" },
    rewardUnlockId: "unlock:operations-catch-up",
    trigger: "unlock:operations-catch-up"
  },
  {
    id: "message:maya-private-contracts-intro",
    sender: "Maya Reyes",
    senderRole: "co-founder",
    subject: "Small work still counts",
    body: "Private contracts are not glamorous, but they can keep fuel in the tanks while scheduled traffic grows.\n\nTake work that fits the aircraft and the schedule. A good contract strengthens the airline. A bad one turns the whole week into apology calls.",
    category: "story",
    createdAt: "2026-05-04T08:22:00.000-05:00",
    read: false,
    archived: false,
    relatedObjectiveId: "objective:take-work-where-you-can-get-it",
    storyTags: ["act1", "contracts", "maya"],
    actionTarget: { type: "view-contract" },
    rewardUnlockId: "unlock:private-contracts",
    trigger: "unlock:private-contracts"
  },
  {
    id: "message:maya-finance-view-intro",
    sender: "Maya Reyes",
    senderRole: "co-founder",
    subject: "Revenue is not the same as breathing room",
    body: "A full airplane can still lose money if the route is too expensive to operate. Now that outside work is on the table, we need to watch cash like it matters, because it does.\n\nUse the finance view to see what is actually helping the airline survive.",
    category: "finance",
    createdAt: "2026-05-04T08:26:00.000-05:00",
    read: false,
    archived: false,
    relatedObjectiveId: "objective:watch-the-numbers",
    storyTags: ["act1", "finance", "maya"],
    actionTarget: { type: "view-finance" },
    rewardUnlockId: "unlock:business-finance-view",
    trigger: "unlock:business-finance-view"
  },
  {
    id: "message:maya-maintenance-intro",
    sender: "Maya Reyes",
    senderRole: "co-founder",
    subject: "The aircraft is the airline right now",
    body: "With one aircraft, maintenance is not a department. It is the business.\n\nWatch condition before it becomes a grounding. Spending money early hurts, but losing the only airplane hurts more.",
    category: "operations",
    createdAt: "2026-05-04T08:30:00.000-05:00",
    read: false,
    archived: false,
    relatedObjectiveId: "objective:keep-aircraft-healthy",
    storyTags: ["act1", "maintenance", "maya"],
    actionTarget: { type: "view-maintenance" },
    rewardUnlockId: "unlock:maintenance-view",
    trigger: "unlock:maintenance-view"
  },
  {
    id: "message:maya-reliability-certification",
    sender: "Maya Reyes",
    senderRole: "co-founder",
    subject: "Reliability is how we earn permission",
    body: "The next door opens when people believe we will show up.\n\nKeep the schedule small, protect the aircraft, and build a reliability record that makes commuter certification feel like the next sensible step instead of a gamble.",
    category: "story",
    createdAt: "2026-05-04T08:34:00.000-05:00",
    read: false,
    archived: false,
    relatedObjectiveId: "objective:prove-scheduled-reliability",
    storyTags: ["act1", "reliability", "maya"],
    actionTarget: { type: "view-objective", targetId: "objective:prove-scheduled-reliability" },
    rewardUnlockId: "unlock:expanded-route-planning",
    trigger: "unlock:second-route-permission"
  },
  {
    id: "message:maya-act2-application-guidance",
    sender: "Maya Reyes",
    senderRole: "co-founder",
    subject: "We can apply when you are ready",
    body: "Scheduled Commuter status changes the shape of the airline. More opportunity, more scrutiny, and less room to improvise.\n\nWe do not have to apply the second the door opens. If you want more cash or a cleaner reliability record first, stay here and operate. When you are ready, we make the jump on purpose.",
    category: "story",
    createdAt: "2026-05-04T08:38:00.000-05:00",
    read: false,
    archived: false,
    relatedObjectiveId: "objective:apply-for-scheduled-commuter-status",
    storyTags: ["act1", "certification", "maya"],
    actionTarget: { type: "view-certification" },
    rewardUnlockId: "unlock:commuter-certification-path",
    trigger: "unlock:commuter-certification-path"
  },
  {
    id: "message:dispatch-first-report-ready",
    sender: "Dispatch",
    senderRole: "dispatch",
    subject: "First operating report ready",
    body: "The first operating period is complete. Review the report before adding more flying.",
    category: "operations",
    createdAt: "2026-05-04T08:12:00.000-05:00",
    read: false,
    archived: false,
    relatedObjectiveId: "objective:review-first-report",
    storyTags: ["act1", "dispatch"],
    actionTarget: { type: "view-report" },
    rewardUnlockId: "unlock:operations-report",
    trigger: "objective:run-first-operating-period-complete"
  },
  {
    id: "message:contract-board-private-contracts-open",
    sender: "Contract Board",
    senderRole: "system",
    subject: "Private contract board open",
    body: "Small private opportunities are now available. Review each request against the aircraft, schedule, and cash position before accepting.",
    category: "contract",
    createdAt: "2026-05-04T08:24:00.000-05:00",
    read: false,
    archived: false,
    relatedObjectiveId: "objective:take-work-where-you-can-get-it",
    storyTags: ["act1", "contracts"],
    actionTarget: { type: "view-contract" },
    rewardUnlockId: "unlock:private-contracts",
    trigger: "unlock:private-contracts"
  },
  {
    id: "message:certification-office-path-open",
    sender: "Certification Office",
    senderRole: "system",
    subject: "Scheduled commuter application available",
    body: "Your airline may begin the Scheduled Commuter application when you are ready. Application does not need to be automatic; the founder may continue operating before filing.",
    category: "system",
    createdAt: "2026-05-04T08:36:00.000-05:00",
    read: false,
    archived: false,
    relatedObjectiveId: "objective:apply-for-scheduled-commuter-status",
    storyTags: ["act1", "certification"],
    actionTarget: { type: "view-certification" },
    rewardUnlockId: "unlock:commuter-certification-path",
    trigger: "objective:prove-scheduled-reliability-complete"
  }
] as const;

export const actOneInitialInboxMessageIds = [
  "message:maya-welcome-setup",
  "message:maya-first-route-guidance"
] as const;

export const actOnePrivateContractTemplates = [
  {
    id: "contract:weekend-shuttle",
    type: "private",
    title: "Weekend Shuttle Contract",
    description: "A nearby event needs a short weekend shuttle using small-aircraft capacity.",
    client: "County Events Office",
    sender: "County Events Office",
    actId: ACT_ONE_ID,
    trackable: true,
    riskLevel: "low",
    window: "Weekend operating window placeholder",
    relatedFeatureUnlockId: "unlock:private-contracts",
    suggestedAirportDependency: "Short route from the home airport to a nearby community airport.",
    requirements: [
      {
        type: "operate-route",
        description: "Operate the requested weekend shuttle route.",
        targetValue: 4
      },
      {
        type: "maintain-reliability",
        description: "Keep reliability at or above the contract threshold.",
        targetValue: 80
      }
    ],
    rewards: { cash: 12000, reputation: 1, unlockIds: [], nextObjectiveIds: [] },
    penalties: [{ type: "cash", amount: 2500, description: "Missed weekend service penalty." }],
    status: "offered",
    trackableObjectiveId: "objective:take-work-where-you-can-get-it"
  },
  {
    id: "contract:community-trial-service",
    type: "private",
    title: "Community Trial Service",
    description: "A small airport wants proof that limited scheduled service could work.",
    client: "Community Airport Office",
    sender: "Community Airport Office",
    actId: ACT_ONE_ID,
    trackable: true,
    riskLevel: "moderate",
    window: "Short trial period placeholder",
    relatedFeatureUnlockId: "unlock:private-contracts",
    suggestedAirportDependency: "Community airport within founder aircraft range.",
    requirements: [
      {
        type: "operate-route",
        description: "Operate the trial service on the proposed community route.",
        targetValue: 3
      },
      {
        type: "carry-passengers",
        description: "Carry enough passengers to show community demand.",
        targetValue: 18
      }
    ],
    rewards: {
      cash: 15000,
      reputation: 2,
      operationalTrust: 1,
      unlockIds: [],
      nextObjectiveIds: []
    },
    penalties: [
      { type: "reputation", amount: 1, description: "Weak trial service credibility hit." }
    ],
    status: "offered",
    trackableObjectiveId: "objective:take-work-where-you-can-get-it"
  },
  {
    id: "contract:medical-travel-support",
    type: "private",
    title: "Medical Travel Support",
    description:
      "A clinic network needs dependable transport support for non-emergency patient travel.",
    client: "Regional Clinic Network",
    sender: "Regional Clinic Network",
    actId: ACT_ONE_ID,
    trackable: true,
    riskLevel: "moderate",
    window: "Appointment support window placeholder",
    relatedFeatureUnlockId: "unlock:private-contracts",
    suggestedAirportDependency: "Reliable service between home base and a medical center market.",
    requirements: [
      {
        type: "operate-route",
        description: "Operate the requested medical travel support flights.",
        targetValue: 2
      },
      {
        type: "maintain-reliability",
        description: "Keep reliability high enough for sensitive travel needs.",
        targetValue: 85
      }
    ],
    rewards: {
      cash: 18000,
      reputation: 2,
      operationalTrust: 2,
      unlockIds: [],
      nextObjectiveIds: []
    },
    penalties: [
      { type: "operational-trust", amount: 2, description: "Missed support flight trust penalty." }
    ],
    status: "offered",
    trackableObjectiveId: "objective:take-work-where-you-can-get-it"
  },
  {
    id: "contract:small-business-shuttle",
    type: "private",
    title: "Small Business Shuttle",
    description: "A local employer needs a predictable shuttle for a short business travel window.",
    client: "Small Business Consortium",
    sender: "Small Business Consortium",
    actId: ACT_ONE_ID,
    trackable: true,
    riskLevel: "low",
    window: "Business travel window placeholder",
    relatedFeatureUnlockId: "unlock:private-contracts",
    suggestedAirportDependency: "Business-demand airport pair within the starter aircraft range.",
    requirements: [
      {
        type: "carry-passengers",
        description: "Carry the contracted business travelers.",
        targetValue: 12
      }
    ],
    rewards: { cash: 10000, reputation: 1, unlockIds: [], nextObjectiveIds: [] },
    penalties: [{ type: "cash", amount: 2000, description: "Contract shortfall penalty." }],
    status: "offered",
    trackableObjectiveId: "objective:take-work-where-you-can-get-it"
  },
  {
    id: "contract:tourism-weekend-package",
    type: "private",
    title: "Tourism Weekend Package",
    description: "A tourism bureau wants a seasonal weekend package to test visitor demand.",
    client: "Tourism Bureau",
    sender: "Tourism Bureau",
    actId: ACT_ONE_ID,
    trackable: true,
    riskLevel: "moderate",
    window: "Seasonal weekend placeholder",
    relatedFeatureUnlockId: "unlock:private-contracts",
    suggestedAirportDependency: "Leisure-demand route with enough turn time for weekend flying.",
    requirements: [
      {
        type: "operate-route",
        description: "Operate the tourism package flights.",
        targetValue: 4
      },
      {
        type: "carry-passengers",
        description: "Carry the package passengers.",
        targetValue: 20
      }
    ],
    rewards: { cash: 16000, reputation: 2, unlockIds: [], nextObjectiveIds: [] },
    penalties: [
      { type: "reputation", amount: 1, description: "Tourism bureau confidence penalty." }
    ],
    status: "offered",
    trackableObjectiveId: "objective:take-work-where-you-can-get-it"
  }
] as const;

export type ActOneContentValidationIssue = {
  path: string;
  message: string;
};

/**
 * Identifies duplicate IDs in a collection and adds issues to the provided list.
 *
 * @param ids - The list of IDs to check for duplicates.
 * @param path - The diagnostic path for reporting issues.
 * @param issues - The list of issues to append to.
 */
const addDuplicateIssues = (
  ids: readonly string[],
  path: string,
  issues: ActOneContentValidationIssue[]
) => {
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) {
      issues.push({ path, message: `Duplicate ID: ${id}` });
    }
    seen.add(id);
  }
};

/**
 * Adds a validation issue if a required reference is missing.
 *
 * @param exists - Boolean indicating if the reference exists.
 * @param path - The diagnostic path for reporting issues.
 * @param message - The error message to report if missing.
 * @param issues - The list of issues to append to.
 */
const addMissingReferenceIssue = (
  exists: boolean,
  path: string,
  message: string,
  issues: ActOneContentValidationIssue[]
) => {
  if (!exists) {
    issues.push({ path, message });
  }
};

/**
 * Filters the feature unlock catalog for those available at the start of Act 1.
 * Preserves the ordering defined in the actOneMetadata.startingFeatureUnlockIds list.
 *
 * @returns Array of starting feature unlocks.
 * @throws Error if a referenced starting feature unlock ID is missing from the catalog.
 */
export const getActOneStartingFeatureUnlocks = () =>
  actOneMetadata.startingFeatureUnlockIds.map((id) => {
    const unlock = actOneFeatureUnlocks.find((u) => u.id === id);
    if (!unlock) {
      throw new Error(`Starting feature unlock ID missing from catalog: ${id}`);
    }
    return unlock;
  });

/**
 * Filters the inbox message catalog for those sent at the start of Act 1.
 * Preserves the ordering defined in the actOneInitialInboxMessageIds list.
 *
 * @returns Array of initial inbox messages.
 * @throws Error if a referenced initial inbox message ID is missing from the catalog.
 */
export const getActOneInitialInboxMessages = () =>
  actOneInitialInboxMessageIds.map((id) => {
    const message = actOneInboxMessages.find((m) => m.id === id);
    if (!message) {
      throw new Error(`Initial inbox message ID missing from catalog: ${id}`);
    }
    return message;
  });

/**
 * Validates the Zod schemas for all Act 1 content catalogs.
 *
 * @param issues - The list of issues to append to.
 */
const validateActOneSchemas = (issues: ActOneContentValidationIssue[]) => {
  const parsedMetadata = actMetadataSchema.safeParse(actOneMetadata);
  if (!parsedMetadata.success) {
    issues.push({ path: "actOneMetadata", message: parsedMetadata.error.message });
  }

  for (const unlock of actOneFeatureUnlocks) {
    const parsed = featureUnlockSchema.safeParse(unlock);
    if (!parsed.success) {
      issues.push({ path: `actOneFeatureUnlocks.${unlock.id}`, message: parsed.error.message });
    }
  }

  for (const objective of actOneObjectives) {
    const parsed = careerObjectiveSchema.safeParse(objective);
    if (!parsed.success) {
      issues.push({ path: `actOneObjectives.${objective.id}`, message: parsed.error.message });
    }
  }

  for (const message of actOneInboxMessages) {
    const parsed = inboxMessageSchema.safeParse(message);
    if (!parsed.success) {
      issues.push({ path: `actOneInboxMessages.${message.id}`, message: parsed.error.message });
    }
  }

  for (const contract of actOnePrivateContractTemplates) {
    const parsed = contractSchema.safeParse(contract);
    if (!parsed.success) {
      issues.push({
        path: `actOnePrivateContractTemplates.${contract.id}`,
        message: parsed.error.message
      });
    }
  }
};

/**
 * Validates that all IDs in Act 1 catalogs are unique.
 *
 * @param issues - The list of issues to append to.
 */
const validateActOneUniqueness = (issues: ActOneContentValidationIssue[]) => {
  addDuplicateIssues(
    actOneFeatureUnlocks.map((unlock) => unlock.id),
    "actOneFeatureUnlocks",
    issues
  );
  addDuplicateIssues(
    actOneObjectives.map((objective) => objective.id),
    "actOneObjectives",
    issues
  );
  addDuplicateIssues(
    actOneInboxMessages.map((message) => message.id),
    "actOneInboxMessages",
    issues
  );
  addDuplicateIssues(
    actOnePrivateContractTemplates.map((contract) => contract.id),
    "actOnePrivateContractTemplates",
    issues
  );
};

type ContentLookupSets = {
  objectiveIds: ReadonlySet<string>;
  unlockIds: ReadonlySet<string>;
  messageIds: ReadonlySet<string>;
};

/**
 * Validates references from Act 1 metadata and initial lists.
 *
 * @param issues - The list of issues to append to.
 * @param sets - Lookup sets for reference validation.
 */
const validateActOneMetadataReferences = (
  issues: ActOneContentValidationIssue[],
  sets: ContentLookupSets
) => {
  addMissingReferenceIssue(
    sets.objectiveIds.has(ACT_ONE_DEFAULT_TRACKED_OBJECTIVE_ID),
    "ACT_ONE_DEFAULT_TRACKED_OBJECTIVE_ID",
    "Default tracked objective must exist.",
    issues
  );

  for (const id of actOneMetadata.startingFeatureUnlockIds) {
    addMissingReferenceIssue(
      sets.unlockIds.has(id),
      `actOneMetadata.startingFeatureUnlockIds.${id}`,
      "Starting feature unlock must exist.",
      issues
    );
  }

  for (const id of actOneInitialInboxMessageIds) {
    addMissingReferenceIssue(
      sets.messageIds.has(id),
      `actOneInitialInboxMessageIds.${id}`,
      "Initial inbox message must exist.",
      issues
    );
  }
};

/**
 * Validates cross-references within the Act 1 objective catalog.
 *
 * @param issues - The list of issues to append to.
 * @param sets - Lookup sets for reference validation.
 */
const validateActOneObjectiveReferences = (
  issues: ActOneContentValidationIssue[],
  sets: ContentLookupSets
) => {
  for (const objective of actOneObjectives) {
    if ("nextObjectiveId" in objective && objective.nextObjectiveId) {
      addMissingReferenceIssue(
        sets.objectiveIds.has(objective.nextObjectiveId),
        `actOneObjectives.${objective.id}.nextObjectiveId`,
        "Next objective must exist.",
        issues
      );
    }

    for (const id of objective.rewards.nextObjectiveIds) {
      addMissingReferenceIssue(
        sets.objectiveIds.has(id),
        `actOneObjectives.${objective.id}.rewards.nextObjectiveIds`,
        `Reward next objective must exist: ${id}`,
        issues
      );
    }

    for (const id of objective.rewards.unlockIds) {
      addMissingReferenceIssue(
        sets.unlockIds.has(id),
        `actOneObjectives.${objective.id}.rewards.unlockIds`,
        `Reward unlock must exist: ${id}`,
        issues
      );
    }

    for (const id of objective.relatedFeatureUnlockIds) {
      addMissingReferenceIssue(
        sets.unlockIds.has(id),
        `actOneObjectives.${objective.id}.relatedFeatureUnlockIds`,
        `Related feature unlock must exist: ${id}`,
        issues
      );
    }

    for (const id of objective.relatedInboxMessageIds) {
      addMissingReferenceIssue(
        sets.messageIds.has(id),
        `actOneObjectives.${objective.id}.relatedInboxMessageIds`,
        `Related inbox message must exist: ${id}`,
        issues
      );
    }
  }
};

/**
 * Validates cross-references within the Act 1 inbox message catalog.
 *
 * @param issues - The list of issues to append to.
 * @param sets - Lookup sets for reference validation.
 */
const validateActOneMessageReferences = (
  issues: ActOneContentValidationIssue[],
  sets: ContentLookupSets
) => {
  for (const message of actOneInboxMessages) {
    if (message.relatedObjectiveId) {
      addMissingReferenceIssue(
        sets.objectiveIds.has(message.relatedObjectiveId),
        `actOneInboxMessages.${message.id}.relatedObjectiveId`,
        "Message related objective must exist.",
        issues
      );
    }
    if ("rewardUnlockId" in message && message.rewardUnlockId) {
      addMissingReferenceIssue(
        sets.unlockIds.has(message.rewardUnlockId),
        `actOneInboxMessages.${message.id}.rewardUnlockId`,
        "Message reward unlock must exist.",
        issues
      );
    }
  }
};

/**
 * Validates cross-references within the Act 1 private contract templates.
 *
 * @param issues - The list of issues to append to.
 * @param sets - Lookup sets for reference validation.
 */
const validateActOneContractReferences = (
  issues: ActOneContentValidationIssue[],
  sets: ContentLookupSets
) => {
  for (const contract of actOnePrivateContractTemplates) {
    if (contract.relatedFeatureUnlockId) {
      addMissingReferenceIssue(
        sets.unlockIds.has(contract.relatedFeatureUnlockId),
        `actOnePrivateContractTemplates.${contract.id}.relatedFeatureUnlockId`,
        "Contract related feature unlock must exist.",
        issues
      );
    }
    if (contract.trackableObjectiveId) {
      addMissingReferenceIssue(
        sets.objectiveIds.has(contract.trackableObjectiveId),
        `actOnePrivateContractTemplates.${contract.id}.trackableObjectiveId`,
        "Contract trackable objective must exist.",
        issues
      );
    }
  }
};

/**
 * Validates Act 1 content schemas and cross-references.
 *
 * @returns A list of content validation issues. Empty means the content is consistent.
 */
export const validateActOneContent = (): ActOneContentValidationIssue[] => {
  const issues: ActOneContentValidationIssue[] = [];

  validateActOneSchemas(issues);
  validateActOneUniqueness(issues);

  const sets: ContentLookupSets = {
    objectiveIds: new Set<string>(actOneObjectives.map((obj) => obj.id)),
    unlockIds: new Set<string>(actOneFeatureUnlocks.map((unlock) => unlock.id)),
    messageIds: new Set<string>(actOneInboxMessages.map((msg) => msg.id))
  };

  validateActOneMetadataReferences(issues, sets);
  validateActOneObjectiveReferences(issues, sets);
  validateActOneMessageReferences(issues, sets);
  validateActOneContractReferences(issues, sets);

  return issues;
};

