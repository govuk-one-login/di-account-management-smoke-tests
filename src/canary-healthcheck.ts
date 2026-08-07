import { createRequire } from "node:module";
import { getParameter } from "./aws.js";

export const validateHealthcheckResponse = (res: {
  statusCode: number;
  body: string;
}) => {
  if (res.statusCode !== 200) {
    throw new Error(`Expected 200 but got ${res.statusCode}`);
  }
  if (!res.body.includes("ok")) {
    throw new Error(`Response body does not contain 'ok'`);
  }
};

export const handler = async () => {
  const require = createRequire(import.meta.url);
  const synthetics = require("Synthetics");

  synthetics.getConfiguration().setConfig({
    screenshotOnStepStart: false,
    screenshotOnStepSuccess: false,
    screenshotOnStepFailure: true,
  });

  const baseUrl = await getParameter("base-url");

  await synthetics.executeHttpStep(
    "GET /healthcheck",
    `${baseUrl}/healthcheck`,
    validateHealthcheckResponse,
    { includeResponseBody: true },
  );
};
