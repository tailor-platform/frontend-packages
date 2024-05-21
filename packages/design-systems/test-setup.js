import "@testing-library/jest-dom/vitest";

const initialTimezone = process.env.TZ;
let teardownHappened = false;

export const setup = async () => {
  process.env.TZ = "Asia/Tokyo";

  return async () => {
    if (teardownHappened) throw new Error("teardown called twice");
    teardownHappened = true;

    process.env.TZ = initialTimezone;
  };
};
