module.exports = {
  types: [
    { value: "feat", name: "feat:     A new feature" },
    { value: "fix", name: "fix:      A bug fix" },
    {
      value: "refactor",
      name: "refactor: A code change that neither fixes a bug nor adds a feature",
    },
    {
      value: "chore",
      name: "chore:    Changes to the build process or auxiliary tools\n            and libraries such as documentation generation",
    },
  ],

  scopes: [
    { name: "client" },
    { name: "datagrid" },
    { name: "dev-config" },
    { name: "ds" },
    { name: "monitoring" },
    { name: "oidc-client" },
    { name: "storybook" },
    { name: "utils" },
    { name: "mtctl" },
  ],

  usePreparedCommit: false,
  allowTicketNumber: false,
  isTicketNumberRequired: false,
  ticketNumberPrefix: "TICKET-",
  ticketNumberRegExp: "\\d{1,5}",

  messages: {
    type: "Select the type of change that you're committing:",
    scope: "\nDenote the SCOPE of this change (optional):",
    customScope: "Denote the SCOPE of this change:",
    subject: "Write a SHORT, IMPERATIVE tense description of the change:\n",
    body: `Provide a LONGER description of the change (optional). Use "|" to break new line:\n`,
    breaking: "List any BREAKING CHANGES (optional):\n",
    footer:
      "List any ISSUES CLOSED by this change (optional). E.g.: #31, #34:\n",
    confirmCommit: "Are you sure you want to proceed with the commit above?",
  },

  allowCustomScopes: true,
  allowBreakingChanges: ["feat", "fix"],
  skipQuestions: ["body", "footer"],
  subjectLimit: 100,
};
