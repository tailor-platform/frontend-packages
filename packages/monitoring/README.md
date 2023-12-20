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

### Default Configurations

The package provides default configurations for Datadog RUM integration. Below are the defaults:

- **`applicationId`**: Pulled from the environment variable `NEXT_PUBLIC_DATADOG_RUM_APPLICATION_ID`.
- **`clientToken`**: Pulled from the environment variable `NEXT_PUBLIC_DATADOG_RUM_CLIENT_TOKEN`.
- **`site`**: By default, it is set to "us3.datadoghq.com".
- **`service`**: Pulled from the environment variable `NEXT_PUBLIC_DATADOG_RUM_SERVICE`.
- **`env`**: Based on the value of `NEXT_PUBLIC_VERCEL_ENV`, it is determined as either "prod" or "dev".
- **`version`**: Pulled from the environment variable `NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA`.
- **`sessionSampleRate`**: Defaults to 100.
- **`sessionReplaySampleRate`**: Defaults to 100.
- **`trackResources`**: Defaults to `true`.
- **`trackLongTasks`**: Defaults to `true`.
- **`trackUserInteractions`**: Defaults to `true`.

As the example above shows, these default configurations can be overridden by passing custom values when initializing the monitoring tool. More configuration details and available options can be found [here](https://docs.datadoghq.com/real_user_monitoring/browser/#configuration).

### Environment Variables

The package relies on certain environment variables for its configuration. These are detailed below:

- **`NEXT_PUBLIC_VERCEL_ENV`**: Determines the environment in which the application is running. For example, if it's set to "production", the `datadogEnvironment` will be "prod". Otherwise, it defaults to "dev".
- **`NEXT_PUBLIC_DATADOG_RUM_APPLICATION_ID`**: The application ID used for Datadog RUM.
- **`NEXT_PUBLIC_DATADOG_RUM_CLIENT_TOKEN`**: The client token used for Datadog RUM.
- **`NEXT_PUBLIC_DATADOG_RUM_SERVICE`**: The service name used for Datadog RUM.
- **`NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA`**: Tracking versions used for Datadog RUM.

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
