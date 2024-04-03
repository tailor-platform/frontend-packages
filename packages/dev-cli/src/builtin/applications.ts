import {$$, tailorctl} from "@script/helper.js";

export const applications = async () => {
  const format = process.env.__CMDOPTS_FORMAT || "json";
  await $$`${tailorctl} alpha workspace app list -f ${format}`;
}

await applications();