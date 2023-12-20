import { TailorGqlDate } from "../types";

export const tailorDate = (
  arg1: Date | number | string,
  arg2?: number,
  arg3?: number,
) => {
  return new TailorDate(arg1, arg2, arg3);
};

const ISOPattern =
  /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2}))$/;
const yyyymmddPattern = /^(?<year>\d{4})(?<month>\d{2})(?<day>\d{2})$/;

class TailorDate {
  public date: TailorGqlDate | undefined;

  constructor(arg1: Date | number | string, arg2?: number, arg3?: number) {
    if (arg1 instanceof Date) {
      this.date = this.formatToGqlDate(arg1);
    } else if (
      typeof arg1 === "number" &&
      typeof arg2 === "number" &&
      typeof arg3 === "number"
    ) {
      const dateObj = new Date(arg1, arg2 - 1, arg3);
      this.date = this.formatToGqlDate(dateObj);
    } else if (typeof arg1 === "string") {
      if (ISOPattern.test(arg1)) {
        this.date = this.formatToGqlDate(new Date(arg1));
      } else if (yyyymmddPattern.test(arg1)) {
        const match = yyyymmddPattern.exec(arg1);

        if (match && match.groups) {
          this.date = Object.values(match.groups).join("-") as TailorGqlDate;
        }
      } else if (this.isGqlFormat(arg1)) {
        this.date = arg1 as TailorGqlDate;
      } else {
        this.date = "1900-01-01";
      }
    } else {
      this.date = "1900-01-01";
    }
  }

  private isGqlFormat(date: string) {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
  }

  private formatToGqlDate(date: Date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date
      .getDate()
      .toString()
      .padStart(2, "0")}` as TailorGqlDate;
  }

  getFirstDayOfMonth(): TailorGqlDate {
    if (!this.date) return "1900-01-01";
    const [year, month] = this.date.split("-").map(Number);

    return `${year}-${month.toString().padStart(2, "0")}-01` as TailorGqlDate;
  }

  getLastDayOfMonth(): TailorGqlDate {
    if (!this.date) return "1900-01-30";
    const [year, month] = this.date.split("-").map(Number);
    const lastDate = new Date(year, month, 0).getDate();

    return `${year}-${month.toString().padStart(2, "0")}-${lastDate
      .toString()
      .padStart(2, "0")}` as TailorGqlDate;
  }
}
