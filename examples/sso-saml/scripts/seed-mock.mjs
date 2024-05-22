import { $$ } from "@tailor-platform/dev-cli/script";
import { importSeeds } from "./import.mjs";

await $$`rm -rf ./tmp`;
await $$`mkdir -p ./tmp/mock`;
await importSeeds([
  "user",
]);
