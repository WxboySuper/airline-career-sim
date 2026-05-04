import { describe, expect, it } from "vitest";

import { simulationModuleStatus } from "./index";

describe("game-core package", () => {
  it("keeps simulation logic isolated in the core package boundary", () => {
    expect(simulationModuleStatus).toBe("foundation-ready");
  });
});
