/** @returns {Promise<import('jest').Config>} */
export default async () => {
    return {
      verbose: false,
      setupFilesAfterEnv: ['./setupJest.mjs'],
      testSequencer: "./testSequencer.cjs",
    };
  };