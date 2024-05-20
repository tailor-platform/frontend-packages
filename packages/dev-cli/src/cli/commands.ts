export type Command = {
  description: string;
  path: string;
  options?: {
    usage: string;
    description: string;
    default: unknown;
  }[];
};
type Commands = Record<string, Command>;

export const commands: Commands = {
  start: {
    description: "start local dev environment",
    path: "builtin/start",
    options: [
      {
        usage: "--only-file",
        description: "only geneate files",
        default: false,
      },
      {
        usage: "--env <value>",
        description: "environment to apply",
        default: "local",
      },
      {
        usage: "--apply",
        description: "apply after starting up environment",
        default: false,
      },
    ],
  },
  reset: {
    description: "reset local dev environment",
    path: "builtin/reset",
  },
  apply: {
    description: "apply manifest onto local environment",
    path: "builtin/apply",
    options: [
      {
        usage: "--env <value>",
        description: "environment to apply",
        default: "local",
      },
      {
        usage: "--default-vault",
        description:
          "add a default vault (effective only when --init-workspace is set)",
        default: false,
      },
      {
        usage: "--only-eval",
        description: "only evaluate manifests",
        default: false,
      },
      {
        usage: "--init",
        description: "initialize pre-requisites (workspace, vault)",
        default: false,
      },
    ],
  },
  applications: {
    description: "list applications",
    path: "builtin/applications",
  },
  "install:deps": {
    description: "install required dependencies (tailorctl, cuelang)",
    path: "builtin/install-deps",
    options: [
      {
        usage: "--tailorctl-version <version>",
        description: "tailorctl version to download",
        default: "v0.8.1",
      },
      {
        usage: "--cuelang-version <version>",
        description: "cuelang version to download",
        default: "v0.7.0",
      },
    ],
  },
  "uninstall:deps": {
    description: "uninstall dependencies",
    path: "builtin/uninstall-deps",
    options: [],
  },
  machineuser: {
    description: "get machine user",
    path: "builtin/machine-user",
    options: [
      {
        usage: "-u, --machine-username <machineUsername>",
        description: "machine user token",
        default: "",
      },
      {
        usage: "-a, --application <application>",
        description: "application name",
        default: "",
      },
      {
        usage: "-f, --format <format>",
        description: "format json or table",
        default: "",
      },
    ],
  },
  "machineuser:token": {
    description: "get machine user token",
    path: "builtin/machine-user-token",
    options: [
      {
        usage: "-a, --application <application>",
        description: "application name",
        default: "",
      },
      {
        usage: "-f, --format <format>",
        description: "format json or table",
        default: "",
      },
    ],
  },
  "vault:list": {
    description: "list secrets",
    path: "builtin/vault-list",
    options: [
      {
        usage: "--format <format>",
        description: "format json or table",
        default: "json",
      },
    ],
  },
  "vault:create": {
    description: "create a secret",
    path: "builtin/vault-create",
    options: [
      {
        usage: "-n, --name <vaultName>",
        description: "vault name",
        default: "",
      },
      {
        usage: "--format <format>",
        description: "format json or table",
        default: "json",
      },
    ],
  },
  "vault:secret:create": {
    description: "create a secret",
    path: "builtin/vault-secret-create",
    options: [
      {
        usage: "-s, --secretName <secretName>",
        description: "secret name",
        default: "",
      },
      {
        usage: "-v, --secretValue <secretValue>",
        description: "secret value",
        default: "",
      },
      {
        usage: "-n, --vaultName <vaultName>",
        description: "vault name",
        default: "",
      },
      {
        usage: "--format <format>",
        description: "format json or table",
        default: "json",
      },
    ],
  },
} as const;
