import { Corona } from "../interfaces/corona";

// formats as 2020-01-02
export const formatDate = (d: Date): string =>
  `${d.getFullYear()}-${String(1 + d.getMonth()).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

export const extractDates = (infectionData: Corona) => {
  const confirmedDates = infectionData.confirmed
    .map(c => new Date(c.date))
    .map(formatDate);
  const deathDates = infectionData.deaths
    .map(c => new Date(c.date))
    .map(formatDate);
  // trim duplicates
  const dates = [...new Set([...confirmedDates, ...deathDates])].sort();
  return dates;
};
