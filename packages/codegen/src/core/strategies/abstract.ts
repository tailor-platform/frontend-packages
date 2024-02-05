import { TableSchema } from "../schema.js";

export type AbstractGenerator = {
  run(): Promise<string | null>;
  outfile(): string;
};

export abstract class AbstractGeneratorBase {
  readonly tables: Map<string, TableSchema>;

  constructor(types: Array<TableSchema>) {
    this.tables = types.reduce((a, b) => {
      return a.set(b.name, b);
    }, new Map());
  }
}
