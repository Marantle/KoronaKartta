import {CoronaData} from '../components/map/Map'

export const extractDates = (coronaData: CoronaData)  => {
  const formatDate = (d: Date): string =>
    `${d.getFullYear()}-${String(1 + d.getMonth()).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  const confirmedDates = coronaData.rawInfectionData.confirmed
    .map(c => new Date(c.date))
    .map(formatDate);
  const recoveredDates = coronaData.rawInfectionData.recovered
    .map(c => new Date(c.date))
    .map(formatDate)
    const dates = [...new Set(...[confirmedDates, recoveredDates])].sort();
  return dates;
}