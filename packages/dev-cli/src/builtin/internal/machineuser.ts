import {$$, tailorctl} from "@script/index.js";

export const machineUserToken = async () => {
  const application = process.env.__CMDOPTS_APPLICATION || "";
  const machineUser = process.env.__CMDOPTS_MACHINE_USERNAME || "";
  const format = process.env.__CMDOPTS_FORMAT || "json";
  await $$`${tailorctl} alpha workspace machineuser token -a ${application} -m ${machineUser} -f ${format}`;
}

export const machineUser = async () => {
  const application = process.env.__CMDOPTS_APPLICATION || "";
  const format = process.env.__CMDOPTS_FORMAT || "json";
  await $$`${tailorctl} alpha workspace machineuser list -a ${application} -f ${format}`;
}