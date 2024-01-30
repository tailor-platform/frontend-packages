import { createContext, type ReactNode, useContext } from "react";

type ContextConfig = {
  apiUrl: string;
  oidcLoginPath: string;
  oidcLoginCallbackPath: string;
  oidcTokenPath: string;
  oidcRefreshTokenPath: string;
  oidcUserInfoPath: string;
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
    oidcLoginPath,
    oidcLoginCallbackPath,
    oidcTokenPath,
    oidcRefreshTokenPath,
    oidcUserInfoPath,
  } = props.config;
  const config: ContextConfig = {
    apiUrl,
    oidcLoginPath: oidcLoginPath || `/auth/login`,
    oidcLoginCallbackPath: oidcLoginCallbackPath || "/login/callback",
    oidcTokenPath: oidcTokenPath || "/auth/token",
    oidcRefreshTokenPath: oidcRefreshTokenPath || "/auth/token/refresh",
    oidcUserInfoPath: oidcUserInfoPath || "/auth/userinfo",
  };

  return (
    <TailorOidcContext.Provider value={config}>
      {props.children}
    </TailorOidcContext.Provider>
  );
};
