import { Dateish } from "@/types";

const DATE_FACTORS = [
  {
    long: "days",
    short: "d",
    factor: 24,
    cummulative: 86_400_000,
  },
  {
    long: "hours",
    short: "h",
    factor: 60,
    cummulative: 3_600_000,
  },
  {
    long: "minutes",
    short: "m",
    factor: 60,
    cummulative: 60_000,
  },
  {
    long: "seconds",
    short: "s",
    factor: 1000,
    cummulative: 1_000,
  },
];

export const formatDate = (
  date?: Date | string | number,
  options?: Intl.DateTimeFormatOptions
) => {
  if (!date) return "";
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  };
  return new Intl.DateTimeFormat("en-US", dateOptions).format(new Date(date));
};

export const formatDateTime = (
  date?: Date | string | number,
  options?: Intl.DateTimeFormatOptions
) => {
  return formatDate(date, {
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  });
};

export const formatDateDiff = (start?: Dateish, end?: Dateish) => {
  const fallback = Date.now();
  const startDate = new Date(start || fallback);
  const endDate = new Date(end || fallback);
  const diff = endDate.getTime() - startDate.getTime();
  const sign = diff < 0 ? "-" : "";
  const absDiff = Math.abs(diff);
  const firstGreaterThanOne = DATE_FACTORS.find(
    ({ cummulative }) => absDiff / cummulative > 1
  );
  if (!firstGreaterThanOne) return "0s";
  return `${sign}${Math.floor(absDiff / firstGreaterThanOne.cummulative)} ${
    firstGreaterThanOne.long
  }`;
};
