import { createRequire } from "node:module";
import { SSM } from "@aws-sdk/client-ssm";

const ssm = new SSM();

export const getParameter = async (parameterName: string): Promise<string> => {
  const require = createRequire(import.meta.url);
  const synthetics = require("Synthetics");
  const canaryName = synthetics.getCanaryName();
  const result = await ssm.getParameter({
    Name: `${canaryName}-${parameterName}`,
    WithDecryption: true,
  });
  return result.Parameter?.Value ?? "";
};
