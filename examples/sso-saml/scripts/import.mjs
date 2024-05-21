import apollo from "@apollo/client";
import { readCSV } from "./reader.mjs";
import inflection from "inflection";
import * as gqlbuilder from "gql-query-builder";

const gqlEndpoint = `${process.env.APP_URL ?? "http://sso-saml-local.mini.tailor.tech:8000"}/query`;

const client = new apollo.ApolloClient({
  link: new apollo.HttpLink({
    uri: gqlEndpoint,
  }),
  cache: new apollo.InMemoryCache(),
});

export const importSeeds = async (seeds) => {
  for (const seed of seeds) {
    const records = await readCSV(seed);
    const tableName = inflection.camelize(seed);

    console.log("Importing...", tableName);

    for (const record of records) {
      const { query, variables } = gqlbuilder.mutation({
        operation: `create${tableName}`,
        variables: {
          input: {
            type: `${tableName}CreateInput`,
            value: record,
          },
        },
        fields: ["id"],
      });

      try {
        await client.mutate({
          mutation: apollo.gql(query),
          variables,
        });
      } catch (e) {
        console.error("Error", e);
        console.error("Variables", variables);
        process.exit(1);
      }
    }
  }
};
