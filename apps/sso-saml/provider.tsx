"use client"
import { TailorAuthProvider } from "@tailor-platform/auth/client";
import { config } from "./authConfig";
import {ReactNode} from "react";
import {ApolloClient, from, InMemoryCache} from "@apollo/client";
import {removeTypenameFromVariables} from "@apollo/client/link/remove-typename";
import {authenticatedHttpLink} from "@tailor-platform/auth/adapters/apollo";
import dynamic from "next/dynamic";

export const ApolloProvider = dynamic(
  () => import("@apollo/client").then((modules) => modules.ApolloProvider),
  { ssr: false },
);

export const cache = new InMemoryCache();

const removeTypenameLink = removeTypenameFromVariables();

const client = new ApolloClient({
  cache: cache,
  link: from([removeTypenameLink, authenticatedHttpLink(config)]),
});

export const Providers = ({ children }: { children: ReactNode }) => (
  <TailorAuthProvider config={config}>
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  </TailorAuthProvider>
);