import { $ } from "execa";

export const resetCommand = async () => {
  await $({
    shell: true,
    stdio: "inherit",
  })`docker compose down --remove-orphans --volumes`;
};
