import { defineConfig } from "@pandacss/dev";

import { buildPandaConfig } from "./node_modules/@tailor-platform/dev-config/pandacss";

export default buildPandaConfig(defineConfig({}));
