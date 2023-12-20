import { createContext, type ReactNode, useContext } from "react";

type Config = {
  apiUrl: string;
  oidcLoginPath: string;
  oidcLoginCallbackPath: string;
  oidcTokenPath: string;
  oidcRefreshTokenPath: string;
  oidcUserInfoPath: string;
};

const TailorOidcContext = createContext<Config | undefined>(undefined);

export const useTailorOidc = () => {
  const context = useContext(TailorOidcContext);
  if (context === undefined) {
    throw new Error("useTailorOidc must be used within a TailorOidcProvider");
  }
  return context;
};

type ConfigProviderProps = {
  config: Config;
  children: ReactNode;
};

export const TailorOidcProvider = ({
  config,
  children,
}: ConfigProviderProps) => {
  return (
    <TailorOidcContext.Provider value={config}>
      {children}
    </TailorOidcContext.Provider>
  );
};
