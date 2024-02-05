#!/usr/bin/env node
import fs from "fs/promises";
import { tailordbSchema } from "../core/schema.js";
import { GQLOpsGenerator } from "../core/table.js";
import { AbstractGenerator } from "../core/strategies/abstract.js";

const runCLI = async () => {
  const r = await fs.readFile("../../../ima-tailordb.json", {
    encoding: "utf8",
  });
  const tailordb = tailordbSchema.parse(JSON.parse(r));
  const generators: Array<AbstractGenerator> = [
    new GQLOpsGenerator(tailordb.types),
  ];

  generators.forEach(async (gen) => {
    const result = await gen.run();
    if (result) {
      await fs.writeFile(gen.outfile(), result);
    }
  });
};

runCLI();
