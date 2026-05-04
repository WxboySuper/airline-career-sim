import { describe, expect, it } from "vitest";

import { dataModuleStatus } from "./index";

describe("game-data package", () => {
  it("exposes the data package boundary", () => {
    expect(dataModuleStatus).toBe("foundation-ready");
  });
});
