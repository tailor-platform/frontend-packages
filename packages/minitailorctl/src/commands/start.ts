import * as fs from "fs/promises";
import { $ } from "execa";
import { LevelledLogger } from "../logger.js";
import { composeYaml } from "../templates/compose.yaml.js";

export const startCommand = async (logger: LevelledLogger) => {
  if (!(await isFileExist("./compose.yml"))) {
    await fs.writeFile("./compose.yml", composeYaml().trim());
    logger.info("generate", "Generated compose.yml");
  }

  await $({
    shell: true,
    stdio: "inherit",
  })`docker compose up -d`;
};

const isFileExist = (file: string) =>
  new Promise((resolve) => {
    fs.access(file, fs.constants.R_OK)
      .then(() => resolve(true))
      .catch(() => resolve(false));
  });
