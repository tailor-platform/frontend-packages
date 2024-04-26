import { createContext, type ReactNode, useContext, useState } from "react";
import { Config } from "@core/config";
import { SessionResult, UserInfo } from "@core/types";

type AuthContext = {
  config: Config;
  session: SessionResult | null;
  updateSession: (session: SessionResult | null) => void;
  currentUser: UserInfo | null;
  updateCurrentUser: (user: UserInfo | null) => void;
};

const TailorAuthContext = createContext<AuthContext | undefined>(undefined);

export const useTailorAuth = () => {
  const context = useContext(TailorAuthContext);
  if (context === undefined) {
    throw new Error("useTailorAuth must be used within a TailorAuthProvider");
  }
  return context;
};

type ConfigProviderProps = {
  config: Config;
  children: ReactNode;
};

/**
 * React provider component that makes hooks functionality available to children components.
 *
 * @example
 * ```
 * import { TailorAuthProvider } from "@tailor-platform/auth/client";
 * import { config } from "@/libs/authConfig";
 *
 * export const Providers = ({ children }: { children: ReactNode }) => (
 *  <TailorAuthProvider config={config}>{children}</TailorAuthProvider>
 * );
 * ```
 */
export const TailorAuthProvider = (props: ConfigProviderProps) => {
  const [session, updateSession] = useState<SessionResult | null>(null);
  const [currentUser, updateCurrentUser] = useState<UserInfo | null>(null);

  return (
    <TailorAuthContext.Provider
      value={{
        config: props.config,
        session,
        updateSession,
        currentUser,
        updateCurrentUser,
      }}
    >
      {props.children}
    </TailorAuthContext.Provider>
  );
};
