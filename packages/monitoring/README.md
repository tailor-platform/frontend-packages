# @tailor-platform/monitoring

This package provides tools and utilities for integrating monitoring solutions in your application. While it currently leverages **Datadog** using `@datadog/browser-rum` as the monitoring provider, it's constructed to be adaptable for future monitoring
solutions.

## Datadog

To make the most out of the `@tailor-platform/monitoring` package with Datadog, familiarize yourself with the official documentation by Datadog, available [here](https://docs.datadoghq.com/real_user_monitoring/browser).

### Initializing Monitoring

To initialize the monitoring tool, you can use the `initializeMonitoring` function. This allows you to set up the
monitoring with default or overridden configurations:

```ts
import { initializeMonitoring } from "@tailor-platform/monitoring";

const configOverrides = {
  site: "alternate.monitoring-provider.com",
  sessionSampleRate: 50,
};

initializeMonitoring(configOverrides);
```

### Default Configuration

The package provides a default configuration for the Datadog RUM package:

| Configuration Key       | Default Value                                                                                  |
| ----------------------- | ---------------------------------------------------------------------------------------------- |
| applicationId           | value of the `NEXT_PUBLIC_DATADOG_RUM_APPLICATION_ID` environment variable                     |
| clientToken             | value of the `NEXT_PUBLIC_DATADOG_RUM_CLIENT_TOKEN` environment variable                       |
| site                    | `"us3.datadoghq.com"`                                                                          |
| service                 | value of the `NEXT_PUBLIC_DATADOG_RUM_SERVICE` environment variable                            |
| env                     | computed from the value of the `NEXT_PUBLIC_VERCEL_ENV` environment variable, see next section |
| version                 | value of the `NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA` environment variable                          |
| sessionSampleRate       | `100`                                                                                          |
| sessionReplaySampleRate | `100`                                                                                          |
| defaultPrivacyLevel     | `"mask-user-input"`                                                                            |
| trackResources          | `true`                                                                                         |
| trackLongTasks          | `true`                                                                                         |
| trackUserInteractions   | `true`                                                                                         |

As the example in the previous section shows, the default configuration values can be overridden by passing custom values when calling `initializeMonitoring()`.

For a reference of the configuration keys and their possible values, please refer to the [Datadog RUM documentation](https://docs.datadoghq.com/real_user_monitoring/browser/#configuration).

### Environment Variables

Most of the environment variables used for the default configuration are used "as is", i.e. their values are passed along verbatim.

The exception is the `env` key whose value is computed from the `NEXT_PUBLIC_VERCEL_ENV` environment variable: if the value is `production` then `env` is set to `"prod"`, else it is set to `"dev"`.

### Setting the User

If you wish to set a user for more detailed monitoring, you can utilize the `setMonitoringUser` function, which is a wrapper of `datadogRum.setUser(<USER_CONFIG_OBJECT>)` ([doc link](https://docs.datadoghq.com/real_user_monitoring/browser/modifying_data_and_context/?tab=npm#identify-user-session)):

```ts
import { setMonitoringUser } from "@tailor-platform/monitoring";

const user = {
  id: "user12345",
  email: "user@example.com",
};

setMonitoringUser(user);
```
