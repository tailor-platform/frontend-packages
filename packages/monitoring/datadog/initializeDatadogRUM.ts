import { datadogRum } from "@datadog/browser-rum";
import { type RumInitConfiguration } from "@datadog/browser-rum-core";

const datadogEnvironment =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ? "prod" : "dev";

export const defaultConfig: RumInitConfiguration = {
  applicationId: `${process.env.NEXT_PUBLIC_DATADOG_RUM_APPLICATION_ID}`,
  clientToken: `${process.env.NEXT_PUBLIC_DATADOG_RUM_CLIENT_TOKEN}`,
  site: "us3.datadoghq.com",
  service: `${process.env.NEXT_PUBLIC_DATADOG_RUM_SERVICE}`,
  env: datadogEnvironment,
  version: `${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}`,
  sessionSampleRate: 100,
  sessionReplaySampleRate: 100,
  trackResources: true,
  trackLongTasks: true,
  trackUserInteractions: true,
};

const requiredFields: Array<
  keyof Pick<RumInitConfiguration, "applicationId" | "clientToken" | "service">
> = ["applicationId", "clientToken", "service"];

export const hasRequiredValues = (config: RumInitConfiguration): boolean => {
  const missingFields = requiredFields.filter(
    (field) => config[field] === undefined,
  );
  return missingFields.length === 0;
};

export const initializeDatadogRUM = (
  configOverrides: Partial<RumInitConfiguration> = {},
) => {
  const config = { ...defaultConfig, ...configOverrides };

  if (!hasRequiredValues(config)) {
    return false;
  }

  datadogRum.init(config);
  return true;
};
