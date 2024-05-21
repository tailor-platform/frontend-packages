import "@testing-library/jest-dom/vitest";
import { beforeEach } from "vitest";

beforeEach(() => {
  process.env.TZ = "Asia/Tokyo";
});
