import { tailorTime } from "./";

test("initiate tailor time", () => {
  expect(tailorTime(new Date(2020, 1, 1, 0, 0, 0)).time).toBe("00:00");
  expect(tailorTime(3, 59).time).toBe("03:59");
  expect(tailorTime("01:30").time).toBe("01:30");
  expect(tailorTime("2:30").time).toBe("00:00");
});

test("get total minutes", () => {
  expect(tailorTime(new Date(2020, 1, 1, 3, 59)).getTotalMinutes()).toBe(239);
  expect(tailorTime(3, 59).getTotalMinutes()).toBe(239);
});

test("get minutes", () => {
  expect(tailorTime(new Date(2020, 1, 1, 22, 45, 0)).getMinutes()).toBe(45);
  expect(tailorTime(3, 59).getMinutes()).toBe(59);
  expect(tailorTime("01:30").getMinutes()).toBe(30);
  expect(tailorTime("2:30").getMinutes()).toBe(0);
});

test("get hours", () => {
  expect(tailorTime(new Date(2020, 1, 1, 22, 45, 0)).getHours()).toBe(22);
  expect(tailorTime(3, 59).getHours()).toBe(3);
  expect(tailorTime("01:30").getHours()).toBe(1);
  expect(tailorTime("2:30").getHours()).toBe(0);
});
