import { UseQueryArgs, UseQueryResponse, useQuery } from "urql";

export const useTailorQuery: (args: UseQueryArgs) => UseQueryResponse = (
  args,
) => {
  return useQuery(args);
};

export type { UseQueryArgs, UseQueryResponse } from "urql";
