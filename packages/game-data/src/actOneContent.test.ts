import { describe, expect, it } from "vitest";

import {
  actMetadataSchema,
  careerObjectiveSchema,
  contractSchema,
  featureUnlockSchema,
  inboxMessageSchema
} from "@airline-career-sim/shared";

import {
  ACT_ONE_DEFAULT_TRACKED_OBJECTIVE_ID,
  actOneFeatureUnlocks,
  actOneInboxMessages,
  actOneMetadata,
  actOneObjectives,
  actOnePrivateContractTemplates,
  getActOneInitialInboxMessages,
  getActOneStartingFeatureUnlocks,
  validateActOneContent
} from "./actOneContent";

const unique = (ids: readonly string[]) => new Set(ids).size === ids.length;

describe("Act 1 content foundation", () => {
  it("validates the Act 1 metadata and starting features", () => {
    expect(() => actMetadataSchema.parse(actOneMetadata)).not.toThrow();
    expect(actOneMetadata.displayName).toBe("Founder Operator");
    expect(actOneMetadata.transitionTarget).toEqual({
      actId: "act2",
      displayName: "Scheduled Commuter"
    });
    expect(getActOneStartingFeatureUnlocks().map((unlock) => unlock.id)).toEqual(
      actOneMetadata.startingFeatureUnlockIds
    );
  });

  it("validates feature unlock definitions and their initial/unlocked split", () => {
    for (const unlock of actOneFeatureUnlocks) {
      expect(() => featureUnlockSchema.parse(unlock)).not.toThrow();
    }

    expect(getActOneStartingFeatureUnlocks().map((unlock) => unlock.id)).toEqual([
      "unlock:basic-dashboard",
      "unlock:inbox",
      "unlock:simplified-route-planning",
      "unlock:simplified-schedule-board",
      "unlock:pause-resume-controls"
    ]);
    expect(actOneFeatureUnlocks.map((unlock) => unlock.id)).toContain(
      "unlock:commuter-certification-path"
    );
  });

  it("validates objective ordering, uniqueness, next references, and default tracking", () => {
    for (const objective of actOneObjectives) {
      expect(() => careerObjectiveSchema.parse(objective)).not.toThrow();
    }

    const objectiveIds = actOneObjectives.map((objective) => objective.id);
    expect(unique(objectiveIds)).toBe(true);
    expect(objectiveIds[0]).toBe(ACT_ONE_DEFAULT_TRACKED_OBJECTIVE_ID);
    expect(actOneObjectives.map((objective) => objective.order)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);

    const objectiveIdSet = new Set(objectiveIds);
    for (const objective of actOneObjectives) {
      if (objective.nextObjectiveId) {
        expect(objectiveIdSet.has(objective.nextObjectiveId)).toBe(true);
      }
      for (const nextObjectiveId of objective.rewards.nextObjectiveIds) {
        expect(objectiveIdSet.has(nextObjectiveId)).toBe(true);
      }
    }
  });

  it("validates Maya and operational inbox message templates", () => {
    for (const message of actOneInboxMessages) {
      expect(() => inboxMessageSchema.parse(message)).not.toThrow();
    }

    const messageIds = actOneInboxMessages.map((message) => message.id);
    expect(unique(messageIds)).toBe(true);
    expect(actOneInboxMessages.filter((message) => message.sender === "Maya Reyes")).toHaveLength(10);
    expect(getActOneInitialInboxMessages().map((message) => message.id)).toEqual([
      "message:maya-welcome-setup",
      "message:maya-first-route-guidance"
    ]);
  });

  it("keeps inbox messages tied to valid objectives and unlocks", () => {
    const objectiveIds = new Set(actOneObjectives.map((objective) => objective.id));
    const unlockIds = new Set(actOneFeatureUnlocks.map((unlock) => unlock.id));

    for (const message of actOneInboxMessages) {
      if (message.relatedObjectiveId) {
        expect(objectiveIds.has(message.relatedObjectiveId)).toBe(true);
      }
      if (message.rewardUnlockId) {
        expect(unlockIds.has(message.rewardUnlockId)).toBe(true);
      }
    }
  });

  it("validates private contract templates and unique IDs", () => {
    for (const contract of actOnePrivateContractTemplates) {
      expect(() => contractSchema.parse(contract)).not.toThrow();
    }

    expect(actOnePrivateContractTemplates.map((contract) => contract.title)).toEqual([
      "Weekend Shuttle Contract",
      "Community Trial Service",
      "Medical Travel Support",
      "Small Business Shuttle",
      "Tourism Weekend Package"
    ]);
    expect(unique(actOnePrivateContractTemplates.map((contract) => contract.id))).toBe(true);
  });

  it("passes Act 1 cross-reference validation", () => {
    expect(validateActOneContent()).toEqual([]);
  });
});
