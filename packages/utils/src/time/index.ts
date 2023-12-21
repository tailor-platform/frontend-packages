import { TailorGqlTime } from "../types";

export const tailorTime = (arg1: Date | string | number, arg2?: number) => {
  return new TailorTime(arg1, arg2);
};

export class TailorTime {
  public time: TailorGqlTime | undefined;

  constructor(arg1: Date | string | number, arg2?: number) {
    if (arg1 instanceof Date) {
      const hh = arg1.getHours().toString().padStart(2, "0");
      const mm = arg1.getMinutes().toString().padStart(2, "0");

      this.time = `${hh}:${mm}` as TailorGqlTime;
    } else if (typeof arg1 === "number" && typeof arg2 === "number") {
      this.time = `${arg1.toString().padStart(2, "0")}:${arg2
        .toString()
        .padStart(2, "0")}` as TailorGqlTime;
    } else if (typeof arg1 === "string") {
      if (this.isGqlFormat(arg1)) {
        this.time = arg1 as TailorGqlTime;
      } else {
        this.time = "00:00";
      }
    } else {
      this.time = "00:00";
    }
  }

  private isGqlFormat(time: string) {
    return /^\d{2}:\d{2}$/.test(time);
  }

  getTotalMinutes(): number {
    if (!this.time) return 0;
    const [hour, minute] = this.time.split(":").map(Number);

    return hour * 60 + minute;
  }

  getMinutes(): number {
    if (!this.time) return 0;
    const [, minutes] = this.time.split(":").map(Number);

    return minutes;
  }

  getHours(): number {
    if (!this.time) return 0;
    const [hours] = this.time.split(":").map(Number);

    return hours;
  }
}
