import { TableSchema, TableFields } from "./schema.js";
import {
  AbstractGeneratorBase,
  AbstractGenerator,
} from "./strategies/abstract.js";
import * as gql from "gql-query-builder";
import inflection from "inflection";

export class GQLOpsGenerator
  extends AbstractGeneratorBase
  implements AbstractGenerator
{
  constructor(types: Array<TableSchema>) {
    super(types);
  }

  outfile(): string {
    return "tmp/queries.graphql";
  }

  async run() {
    return Array.from(this.tables.values()).reduce((acc, table) => {
      const fields = this.fieldsByName(table.name);
      if (!fields) {
        return acc;
      }

      const { query } = gql.query(
        {
          operation: inflection.camelize(table.name, true),
          variables: {
            id: {
              type: "ID",
              required: true,
            },
          },
          fields,
        },
        null,
        {
          operationName: `get${table.name}`,
        },
      );

      return acc + "\n\n" + query;
    }, "");
  }

  private fieldsByName(name: string): TableFields | null {
    const table = this.tables.get(name);
    if (table === undefined) {
      return null;
    }
    return Object.keys(table.fields).map((fieldKey) => {
      const field = table.fields[fieldKey];

      if ("fields" in field && field.fields !== undefined) {
        // nested
        return {
          [fieldKey]: Object.keys(field.fields),
        };
      } else if (this.tables.has(field.type)) {
        // relation
        const relationTableFields = this.fieldsByName(field.type);
        if (!relationTableFields) {
          throw new Error("internal error");
        }
        return {
          [fieldKey]: relationTableFields,
        };
      }

      // general types
      return fieldKey;
    });
  }
}
