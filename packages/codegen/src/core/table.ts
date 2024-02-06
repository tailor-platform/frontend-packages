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

      // Generating single queries
      const singleOp = gql.query(
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

      // Generating collection queries
      const collectionOp = gql.query(
        {
          operation: inflection.pluralize(
            inflection.camelize(table.name, true),
          ),
          variables: {
            from: {
              type: "Int",
            },
            size: {
              type: "Int",
            },
            query: {
              type: table.name + "QueryInput",
            },
            order: {
              type: inflection.camelize(table.name) + "OrderInput",
            },
          },
          fields: [
            {
              collection: fields,
            },
          ],
        },
        null,
        {
          operationName: `list${table.name}`,
        },
      );

      return acc + "\n\n" + singleOp.query + "\n\n" + collectionOp.query;
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
