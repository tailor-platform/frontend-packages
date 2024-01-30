import { createContext, type ReactNode, useContext } from "react";
import { Config } from "./config";

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

export const TailorAuthProvider = (props: ConfigProviderProps) => {
  return (
    <TailorAuthContext.Provider value={props.config}>
      {props.children}
    </TailorAuthContext.Provider>
  );
};
