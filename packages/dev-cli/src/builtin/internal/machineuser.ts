import {$$, log, tailorctl} from "@script/index.js";

export const machineUserToken = async () => {
  await log.group("machineUser", "machine user token", async () => {
    const application = process.env.__CMDOPTS_APPLICATION || "";
    const machineUser = process.env.__CMDOPTS_MACHINE_USERNAME || "";
    const format = process.env.__CMDOPTS_FORMAT || "json";
    await $$`${tailorctl} alpha workspace machineuser token -a ${application} -m ${machineUser} -f ${format}`;
  })
}