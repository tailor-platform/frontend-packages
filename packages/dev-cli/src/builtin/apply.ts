import { getConfig } from "../script/index.js";
import { applyV1 } from "./internal/applyV1.js";
import { applyV2 } from "./internal/applyV2.js";

const config = getConfig();
await (config?.version === "v2" ? applyV2 : applyV1)();
