import { internalClientSessionPath } from "@server/middleware/internal";
import { Config } from "@core/config";
import { SessionResult } from "@core/types";

export class SingletonLoader<R> {
  private value: R | null;

  constructor(private readonly loader: (config: Config) => Promise<Response>) {
    this.value = null;
  }

  async load(config: Config) {
    const resp = await this.loader(config);
    this.value = (await resp.json()) as unknown as R;
    return this.value;
  }

  get() {
    return this.value;
  }

  getSuspense(config: Config) {
    if (!this.value) {
      throw this.load(config);
    }
    return this.value;
  }

  // Clear stored value (this is only for test usage)
  clear() {
    this.value = null;
  }
}

export type UserInfo = {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  email: string;
};

export const internalUserinfoLoader = new SingletonLoader<UserInfo>(
  async (config) => {
    const session = await internalClientSessionLoader.load(config);
    return await fetch(config.apiUrl(config.userInfoPath()), {
      headers: {
        Authorization: `Bearer ${session?.token}`,
      },
    });
  },
);

export const internalClientSessionLoader = new SingletonLoader<SessionResult>(
  (config) => fetch(config.appUrl(internalClientSessionPath)),
);
