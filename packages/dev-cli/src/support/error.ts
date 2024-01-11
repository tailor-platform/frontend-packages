export const printError = (e: unknown) => {
  if (e instanceof Error) {
    console.error(`Failed: ${e.message}`);
  } else if (e instanceof Object && "out" in e) {
    // This probably is Error object returned from docker-compose process
    console.error(e.out);
  } else {
    console.error(e);
  }
};
