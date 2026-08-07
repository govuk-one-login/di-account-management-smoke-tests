import { describe, it, expect } from "vitest";
import { validateHealthcheckResponse } from "./canary-healthcheck";

describe("validateHealthcheckResponse", () => {
  it("passes on 200 with ok body", () => {
    expect(() =>
      validateHealthcheckResponse({ statusCode: 200, body: '{"status":"ok"}' }),
    ).not.toThrow();
  });

  it("throws on non-200 status", () => {
    expect(() =>
      validateHealthcheckResponse({ statusCode: 503, body: '{"status":"ok"}' }),
    ).toThrow("Expected 200 but got 503");
  });

  it("throws when body does not contain ok", () => {
    expect(() =>
      validateHealthcheckResponse({ statusCode: 200, body: "error" }),
    ).toThrow("Response body does not contain 'ok'");
  });
});
