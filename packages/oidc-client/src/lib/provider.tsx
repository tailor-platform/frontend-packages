import { createContext, type ReactNode, useContext } from "react";

type ContextConfig = {
  apiUrl: string;
  loginPath: string;
  loginCallbackPath: string;
  tokenPath: string;
  refreshTokenPath: string;
  userInfoPath: string;
};

const TailorOidcContext = createContext<ContextConfig | undefined>(undefined);

export const useTailorOidc = () => {
  const context = useContext(TailorOidcContext);
  if (context === undefined) {
    throw new Error("useTailorOidc must be used within a TailorOidcProvider");
  }
  return context;
};

// Only "apiUrl" should be required
type Config = Pick<ContextConfig, "apiUrl"> & Partial<ContextConfig>;
type ConfigProviderProps = {
  config: Config;
  children: ReactNode;
};

export const TailorOidcProvider = (props: ConfigProviderProps) => {
  const {
    apiUrl,
    loginPath: oidcLoginPath,
    loginCallbackPath: oidcLoginCallbackPath,
    tokenPath: oidcTokenPath,
    refreshTokenPath: oidcRefreshTokenPath,
    userInfoPath: oidcUserInfoPath,
  } = props.config;
  const config: ContextConfig = {
    apiUrl,
    loginPath: oidcLoginPath || `/auth/login`,
    loginCallbackPath: oidcLoginCallbackPath || "/login/callback",
    tokenPath: oidcTokenPath || "/auth/token",
    refreshTokenPath: oidcRefreshTokenPath || "/auth/token/refresh",
    userInfoPath: oidcUserInfoPath || "/auth/userinfo",
  };

  return (
    <TailorOidcContext.Provider value={config}>
      {props.children}
    </TailorOidcContext.Provider>
  );
};
