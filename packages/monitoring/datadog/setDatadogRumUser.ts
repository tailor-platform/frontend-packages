import { datadogRum } from "@datadog/browser-rum";
import { type User } from "@datadog/browser-core";

type UserWithId = { id: string } & Partial<User>;

export const setDatadogRumUser = (user: UserWithId) => {
  if (!user.id) {
    return false;
  }

  try {
    datadogRum.onReady(() => {
      datadogRum.setUser(user);
    });
    return true;
  } catch (e) {
    return false;
  }
};
