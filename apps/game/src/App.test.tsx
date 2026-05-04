import { describe, expect, it } from "vitest";

import { App } from "./App";

describe("game app", () => {
  it("exports the placeholder game component", () => {
    expect(App).toBeTypeOf("function");
  });
});
