const globals = require("globals");
const tsEslint = require("typescript-eslint");
const devConfig = require("@tailor-platform/dev-config/eslint");

module.exports = tsEslint.config(...devConfig);
