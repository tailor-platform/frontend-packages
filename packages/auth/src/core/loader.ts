import { internalClientSessionPath } from "@core/path";
import { Config } from "@core/config";
import { SessionResult, UserInfo } from "@core/types";
import { NoSessionError } from "@core/errors";

// SuspenseLoader is a class that abstracts out the logic of loading a resource from a remote server,
// and caches the result for React Suspense support in client components.
class SuspenseLoader<R> {
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

export const internalSessionLoader = new SuspenseLoader<SessionResult>(
  fetchSession,
);

export const internalUserinfoLoader = new SuspenseLoader<UserInfo>(
  async (config) => {
    const resp = await fetchSession(config);
    const session = (await resp.json()) as unknown as SessionResult;
    if (session.token === "" || session.token === null) {
      throw NoSessionError;
    }

    return await fetch(config.apiUrl(config.userInfoPath()), {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    });
  },
);
