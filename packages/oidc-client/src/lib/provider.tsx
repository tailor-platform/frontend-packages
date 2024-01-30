import { createContext, type ReactNode, useContext } from "react";

type ContextConfig = {
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

// Only "apiUrl" should be required
type Config = Pick<ContextConfig, "apiUrl"> & Partial<ContextConfig>;
type ConfigProviderProps = {
  config: Config;
  children: ReactNode;
};

export const TailorAuthProvider = (props: ConfigProviderProps) => {
  const {
    apiUrl,
    loginPath,
    loginCallbackPath,
    tokenPath,
    refreshTokenPath,
    userInfoPath,
  } = props.config;
  const config: ContextConfig = {
    apiUrl,
    loginPath: loginPath || "/auth/login",
    loginCallbackPath: loginCallbackPath || "/login/callback",
    tokenPath: tokenPath || "/auth/token",
    refreshTokenPath: refreshTokenPath || "/auth/token/refresh",
    userInfoPath: userInfoPath || "/auth/userinfo",
  };

  return (
    <TailorAuthContext.Provider value={config}>
      {props.children}
    </TailorAuthContext.Provider>
  );
};
