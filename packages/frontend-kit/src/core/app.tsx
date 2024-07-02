import { useMemo } from "react";
import {
  Client as UrqlClient,
  Provider as UrqlProvider,
  fetchExchange,
} from "urql";

type DataProviderProps = {
  url: string;
};

const DefaultDataProvider = (
  props: React.PropsWithChildren<DataProviderProps>,
) => (
  <UrqlProvider
    value={
      new UrqlClient({
        url: props.url,
        exchanges: [fetchExchange],
      })
    }
  >
    {props.children}
  </UrqlProvider>
);

type TailorAppProps = {
  url?: string;
  dataProvider?: React.ComponentType<DataProviderProps>;
};

export const TailorApp = (props: React.PropsWithChildren<TailorAppProps>) => {
  const DataProvider = useMemo(
    () => props.dataProvider || DefaultDataProvider,
    [props.dataProvider],
  );

  const Application = () => (
    <div className="tailor-application">
      <div className="header">Header</div>
      <div className="sidebar">Sidebar</div>
      <div className="content">{props.children}</div>
    </div>
  );

  const url = props.url || "http://localhost:3000/query";
  return (
    <DataProvider url={url}>
      <Application />
    </DataProvider>
  );
};
