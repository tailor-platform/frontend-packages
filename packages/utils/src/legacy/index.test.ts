import { TailorGqlDate, TailorGqlTime } from "../types";
import {
  getMinutesFromTailorTime,
  isTailorDate,
  isTailorTime,
  parseDatetime,
  toDate,
  toMinFromTailorTime,
  toTailorDate,
  toTailorTime,
} from "./index";

test("isTailorDate", () => {
  expect(isTailorDate("2020-01-01")).toBeTruthy();
  expect(isTailorDate("2020-01-01" as TailorGqlDate)).toBeTruthy();
  expect(isTailorDate(new Date())).toBeFalsy();
});

test("isTailorTime", () => {
  expect(isTailorTime("00:00")).toBeTruthy();
  expect(isTailorTime("00:00" as TailorGqlTime)).toBeTruthy();
  expect(isTailorTime("0000")).toBeFalsy();
  expect(isTailorTime(new Date())).toBeFalsy();
});

test("getMinutesFromTailorTime", () => {
  expect(getMinutesFromTailorTime("00:00")).toBe(0);
  expect(getMinutesFromTailorTime("00:01")).toBe(1);
  expect(getMinutesFromTailorTime("00:12")).toBe(12);
});

test("toMinFromTailorTime", () => {
  expect(toMinFromTailorTime("00:00")).toBe(0);
  expect(toMinFromTailorTime("00:01")).toBe(1);
  expect(toMinFromTailorTime("01:01")).toBe(61);
});

test("toTailorTimeFromHourMin", () => {
  expect(toTailorTime(0, 0)).toBe("00:00");
  expect(toTailorTime(undefined, undefined)).toBe("00:00");
  expect(toTailorTime(0, 1)).toBe("00:01");
  expect(toTailorTime(0, 10)).toBe("00:10");
  expect(toTailorTime(1, 10)).toBe("01:10");
});

test("toTailorDate", () => {
  expect(toTailorDate(new Date("2020-01-01T00:00:00.000Z"))).toBe("2020-01-01");
});

test("toTailorTime", () => {
  expect(toTailorTime(new Date(2020, 1, 1, 0, 0, 0))).toBe("00:00");
  expect(toTailorTime(new Date(2020, 1, 1, 12, 0, 0))).toBe("12:00");
  expect(toTailorTime(new Date(2020, 1, 1, 1, 23, 0))).toBe("01:23");
  expect(toTailorTime(new Date(2020, 1, 1, 21, 11, 0))).toBe("21:11");
});

test("toDateFromTailorDate", () => {
  expect(toDate("2020-01-01").toISOString()).toBe("2019-12-31T15:00:00.000Z");
});

test("toDateFromTailorTime", () => {
  const current = new Date();
  expect(toDate("00:00").toISOString()).toEqual(
    new Date(
      current.getFullYear(),
      current.getMonth(),
      current.getDate(),
      0,
      0,
      0,
    ).toISOString(),
  );
});

test("parseDatetime", () => {
  const d = parseDatetime("2020-01-02T03:04:05.000Z");
  expect(d.getFullYear()).toBe(2020);
  expect(d.getMonth() + 1).toBe(1);
  expect(d.getDate()).toBe(2);
  expect(d.getHours()).toBe(12);
  expect(d.getMinutes()).toBe(4);
  expect(d.getSeconds()).toBe(5);
});
