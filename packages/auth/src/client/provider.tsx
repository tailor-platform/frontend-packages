import { createContext, type ReactNode, useContext } from "react";
import { Config } from "../core/config";

const TailorAuthContext = createContext<Config | undefined>(undefined);

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
  return (
    <TailorAuthContext.Provider value={props.config}>
      {props.children}
    </TailorAuthContext.Provider>
  );
};
