import { parseISO } from "date-fns";
import { TailorGqlDate, TailorGqlTime } from "../types";

export const isTailorDate = (obj: unknown) =>
  typeof obj === "string" && obj.match(/^\d{4}-\d{2}-\d{2}$/);

export const isTailorTime = (obj: unknown) =>
  typeof obj === "string" && obj.match(/^\d{2}:\d{2}$/);

export const toTailorDate = (date: Date | string): TailorGqlDate => {
  if (date instanceof Date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date
      .getDate()
      .toString()
      .padStart(2, "0")}` as TailorGqlDate;
  } else if (typeof date === "string") {
    const yyyymmdd = date.match(/^(\d{4})(\d{2})(\d{2})$/);
    if (yyyymmdd) {
      return `${yyyymmdd[1]}-${yyyymmdd[2]}-${yyyymmdd[3]}` as TailorGqlDate;
    }
    if (isTailorDate(date)) {
      return date as TailorGqlDate;
    }
  }
  return "1900-01-01";
};

export const toTailorTime = (
  arg1: Date | string | number | undefined,
  arg2?: number,
): TailorGqlTime => {
  if (typeof arg1 === "string") {
    const hhmm = arg1.match(/^(\d{2})(\d{2})$/);
    if (hhmm) {
      return `${hhmm[1]}:${hhmm[2]}` as TailorGqlTime;
    }
  } else if (arg1 instanceof Date) {
    return `${arg1.getHours().toString().padStart(2, "0")}:${arg1
      .getMinutes()
      .toString()
      .padStart(2, "0")}` as TailorGqlTime;
  } else if (typeof arg1 === "number" && typeof arg2 === "number") {
    return `${arg1.toString().padStart(2, "0")}:${arg2
      .toString()
      .padStart(2, "0")}` as TailorGqlTime;
  } else if (typeof arg1 === "number") {
    const hour = Math.floor(arg1 / 60);
    const minute = arg1 % 60;
    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}` as TailorGqlTime;
  }
  return "00:00";
};

export const toMinFromTailorTime = (time: TailorGqlTime): number => {
  if (!isTailorTime(time)) return 0;
  const [hour, minute] = time.split(":").map((n) => parseInt(n));
  return hour * 60 + minute;
};

export const getMinutesFromTailorTime = (time: TailorGqlTime): number => {
  if (!isTailorTime(time)) return 0;
  const [, minute] = time.split(":").map((n) => parseInt(n));
  return minute;
};

export const getHoursFromTailorTime = (time: TailorGqlTime): number => {
  if (!isTailorTime(time)) return 0;
  const [hour] = time.split(":").map((n) => parseInt(n));
  return hour;
};

export const toDate = (
  arg1: TailorGqlDate | TailorGqlTime,
  arg2?: Date | TailorGqlDate,
): Date => {
  if (isTailorDate(arg1)) {
    const [year, month, day] = arg1.split("-").map((n) => parseInt(n));
    return new Date(year, month - 1, day, 0, 0, 0);
  } else if (isTailorTime(arg1) && isTailorDate(arg2)) {
    return toDateFromTailorTime(arg1 as TailorGqlTime, arg2 as TailorGqlDate);
  } else if (isTailorTime(arg1) && arg2 instanceof Date) {
    return toDateFromTailorTime(arg1 as TailorGqlTime, arg2);
  } else if (isTailorTime(arg1) && arg2 === undefined) {
    return toDateFromTailorTime(arg1 as TailorGqlTime, new Date());
  }
  return new Date();
};

const toDateFromTailorTime = (
  time: TailorGqlTime,
  baseDate: Date | TailorGqlDate,
): Date => {
  if (isTailorDate(baseDate)) {
    baseDate = toDate(baseDate as TailorGqlDate);
  }
  const bd = baseDate as Date;
  const [hour, minute] = time.split(":").map((n) => parseInt(n));
  return new Date(bd.getFullYear(), bd.getMonth(), bd.getDate(), hour, minute);
};

export const parseDatetime = (date: string): Date => parseISO(date);

export const firstDayOfMonth = (date: TailorGqlDate): TailorGqlDate => {
  const [year, month] = date.split("-").map((n) => parseInt(n));
  return `${year}-${month.toString().padStart(2, "0")}-01` as TailorGqlDate;
};

export const lastDayOfMonth = (date: TailorGqlDate): TailorGqlDate => {
  const [year, month] = date.split("-").map((n) => parseInt(n));
  const lastDate = new Date(year, month, 0).getDate();
  return `${year}-${month.toString().padStart(2, "0")}-${lastDate
    .toString()
    .padStart(2, "0")}` as TailorGqlDate;
};

export type TailorDate = ReturnType<typeof toTailorDate>;
export type TailorTime = ReturnType<typeof toTailorTime>;
