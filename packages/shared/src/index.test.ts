import { describe, expect, it } from "vitest";

import { productName } from "./index";

describe("shared package", () => {
  it("exports the product name", () => {
    expect(productName).toBe("Airline Career Simulator");
  });
});
