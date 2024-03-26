import { internalClientSessionPath } from "@server/middleware/internal";
import { Config } from "@core/config";
import { SessionResult } from "@core/types";

// SingletonLoader is a class that abstracts out the logic of loading a resource from a remote server,
// and caches the result for React Suspense support in client components.
class SingletonLoader<R> {
  private value: R | null;
  private error: Error | null;

  constructor(private readonly loader: (config: Config) => Promise<Response>) {
    this.value = null;
    this.error = null;
  }

  async load(config: Config) {
    return this.loader(config)
      .then(async (resp) => {
        this.value = (await resp.json()) as unknown as R;
      })
      .catch((error) => {
        if (error instanceof Error) {
          this.error = error;
          throw error;
        }
      });
  }

  get() {
    return this.value;
  }

  getSuspense(config: Config) {
    if (this.error) {
      throw this.error;
    } else if (!this.value) {
      throw this.load(config);
    } else {
      return this.value;
    }
  }

  // Clear stored value (this is only for test usage)
  clear() {
    this.value = null;
    this.error = null;
  }
}

const fetchSession = async (config: Config) =>
  fetch(config.appUrl(internalClientSessionPath));

export const internalClientSessionLoader = new SingletonLoader<SessionResult>(
  fetchSession,
);

export const internalUserinfoLoader = new SingletonLoader<{
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  email: string;
}>(async (config) => {
  const resp = await fetchSession(config);
  const session = (await resp.json()) as unknown as SessionResult;
  return await fetch(config.apiUrl(config.userInfoPath()), {
    headers: {
      Authorization: `Bearer ${session.token}`,
    },
  });
});
