import { $$, tailorctl } from "@script/helper.js";

export const vaultList = async () => {
  const format = process.env.__CMDOPTS_FORMAT || "json";
  await $$`${tailorctl} workspace vault list ${format}`;
};

await vaultList();