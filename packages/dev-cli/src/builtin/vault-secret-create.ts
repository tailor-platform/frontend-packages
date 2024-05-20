import { $$, tailorctl } from "@script/helper.js";

export const vaultSecretCreate = async () => {
  const format = process.env.__CMDOPTS_FORMAT || "json";
  const vaultName = process.env.__CMDOPTS_VAULT_NAME || "";
  const secretName = process.env.__CMDOPTS_SECRET_NAME || "";
  const secretValue = process.env.__CMDOPTS_SECRET_VALUE || "";
  await $$`${tailorctl} workspace vault secret create --vault ${vaultName} --name ${secretName} --value ${secretValue} ${format}`;
};

await vaultSecretCreate();
