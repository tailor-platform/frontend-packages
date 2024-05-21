import "@testing-library/jest-dom/vitest";
import failOnConsole from "vitest-fail-on-console";
import { beforeEach } from "vitest";

failOnConsole();
beforeEach(() => {
  process.env.TZ = "Asia/Tokyo";
});
