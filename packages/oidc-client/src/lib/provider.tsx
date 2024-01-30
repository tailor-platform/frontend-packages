import { createContext, type ReactNode, useContext } from "react";
import { Config } from "./config";

export type ContextConfig = {
  apiUrl: string;
  loginPath: string;
  loginCallbackPath: string;
  tokenPath: string;
  refreshTokenPath: string;
  userInfoPath: string;
};

const TailorAuthContext = createContext<ContextConfig | undefined>(undefined);

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

export const TailorAuthProvider = (props: ConfigProviderProps) => {
  const config: ContextConfig = {
    apiUrl: props.config.apiUrl(),
    loginPath: props.config.loginPath(),
    loginCallbackPath: props.config.loginCallbackPath(),
    tokenPath: props.config.tokenPath(),
    refreshTokenPath: props.config.refreshTokenPath(),
    userInfoPath: props.config.userInfoPath(),
  };

  return (
    <TailorAuthContext.Provider value={config}>
      {props.children}
    </TailorAuthContext.Provider>
  );
};
