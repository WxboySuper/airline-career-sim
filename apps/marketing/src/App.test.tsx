import { describe, expect, it } from "vitest";

import { App } from "./App";

describe("marketing app", () => {
  it("exports the placeholder app component", () => {
    expect(App).toBeTypeOf("function");
  });
});
