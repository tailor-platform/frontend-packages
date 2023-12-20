import { tailorDate } from "./";

test("initiate tailor date", () => {
  expect(tailorDate(new Date(2022, 9, 10)).date).toBe("2022-10-10");
  expect(tailorDate(2023, 10, 11).date).toBe("2023-10-11");
  expect(tailorDate("2022-11-10").date).toBe("2022-11-10");
  expect(tailorDate("20231005").date).toBe("2023-10-05");
  expect(tailorDate("2020-01-02T03:04:05.000Z").date).toBe("2020-01-02");
  expect(tailorDate("some string").date).toBe("1900-01-01");
});

test("get first day of month", () => {
  expect(tailorDate(new Date(2022, 8, 9)).getFirstDayOfMonth()).toBe(
    "2022-09-01",
  );
  expect(tailorDate(2023, 10, 11).getFirstDayOfMonth()).toBe("2023-10-01");
  expect(tailorDate("2022-11-10").getFirstDayOfMonth()).toBe("2022-11-01");
  expect(tailorDate("2020-01-02T03:04:05.000Z").getFirstDayOfMonth()).toBe(
    "2020-01-01",
  );
});

test("get last day of the month", () => {
  expect(tailorDate(new Date(2022, 8, 9)).getLastDayOfMonth()).toBe(
    "2022-09-30",
  );
  expect(tailorDate(2023, 10, 11).getLastDayOfMonth()).toBe("2023-10-31");
  expect(tailorDate("2022-11-10").getLastDayOfMonth()).toBe("2022-11-30");
  expect(tailorDate("2020-01-02T03:04:05.000Z").getLastDayOfMonth()).toBe(
    "2020-01-31",
  );
});
