export const printError = (e: unknown) =>
  e instanceof Error ? console.error(`Failed: ${e.message}`) : console.error(e);
