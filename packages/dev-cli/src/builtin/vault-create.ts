import { $$, tailorctl } from "@script/helper.js";

export const vaultCreate = async () => {
  const format = process.env.__CMDOPTS_FORMAT || "json";
  const vaultName = process.env.__CMDOPTS_VAULT_NAME || "";
  await $$`${tailorctl} workspace vault create -n ${vaultName} ${format}`;
};

await vaultCreate();