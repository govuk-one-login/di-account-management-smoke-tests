import { describe, it, expect } from "vitest";
import {
  validateStatusCode,
  validateBodyContains,
  validateUrlContains,
} from "./helpers";

describe("validateStatusCode", () => {
  const makePage = (statusCode: number, url = "https://example.com") => ({
    url: () => url,
    goto: async (_url: string) => ({ status: () => statusCode }),
  });

  it("passes when status code matches", async () => {
    await expect(
      validateStatusCode(200, makePage(200)),
    ).resolves.toBeUndefined();
  });

  it("throws when status code does not match", async () => {
    await expect(validateStatusCode(200, makePage(404))).rejects.toThrow(
      "Expected status code 200 but got 404",
    );
  });
});

describe("validateBodyContains", () => {
  const makePage = (bodyText: string) => ({
    evaluate: async (_fn: (text: string) => void, expectedText: string) => {
      if (!bodyText.includes(expectedText)) {
        throw new Error(`Page does not contain text '${expectedText}'`);
      }
    },
  });

  it("passes when body contains expected text", async () => {
    await expect(
      validateBodyContains("welcome", makePage("welcome to the page")),
    ).resolves.toBeUndefined();
  });

  it("throws when body does not contain expected text", async () => {
    await expect(
      validateBodyContains("welcome", makePage("nothing here")),
    ).rejects.toThrow("Page does not contain text 'welcome'");
  });
});

describe("validateUrlContains", () => {
  const makePage = (url: string) => ({ url: () => url });

  it("passes when url contains expected slug", async () => {
    await expect(
      validateUrlContains(
        "/healthcheck",
        makePage("https://example.com/healthcheck"),
      ),
    ).resolves.toBeUndefined();
  });

  it("throws when url does not contain expected slug", async () => {
    await expect(
      validateUrlContains("/healthcheck", makePage("https://example.com/home")),
    ).rejects.toThrow(
      "Url is https://example.com/home and does not contain '/healthcheck'",
    );
  });
});
