import { CoronaData } from "../components/map/Map";

// formats as 2020-01-02
const formatDate = (d: Date): string =>
  `${d.getFullYear()}-${String(1 + d.getMonth()).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

export const extractDates = (coronaData: CoronaData) => {
  const confirmedDates = coronaData.rawInfectionData.confirmed
    .map(c => new Date(c.date))
    .map(formatDate);
  const recoveredDates = coronaData.rawInfectionData.recovered
    .map(c => new Date(c.date))
    .map(formatDate);
  // trim duplicates
  const dates = [...new Set(...[confirmedDates, recoveredDates])].sort();
  return dates;
};
