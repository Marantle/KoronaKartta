import { DataType } from "../components/DataSwitcher";
import {
  Confirmed,
  Corona,
  Death,
  Feature,
  HealthCareDistrictName,
} from "../interfaces/corona";

export type HcdEventCount = {
  [key in HealthCareDistrictName]: number;
};

const dateTail = "T23:59:59.000Z";
const unknownHcd = "Sairaanhoitopiiri ei tiedossa";

const countedAlls = new Map<string, HcdEventCount>();
const countedDeaths = new Map<string, HcdEventCount>();

export const countAll = (
  coronaData: Corona,
  time: string = "2022-01-28",
  range: DataType
) => {
  if (countedAlls.has(time + range)) return countedAlls.get(time + range);

  const totals: Partial<HcdEventCount> = {};
  coronaData.confirmed.forEach((confirm: Confirmed) => {
    const hcdName = confirm.healthCareDistrict ?? unknownHcd;
    if (matchDate(time, confirm.date, range)) {
      return;
    }
    if (totals.hasOwnProperty(hcdName)) {
      totals[hcdName] = totals[hcdName] + (confirm.value || 1);
    } else {
      totals[hcdName] = confirm.value || 1;
    }
  });
  countedAlls.set(time + range, totals as HcdEventCount);
  return totals as HcdEventCount;
};

export const countDeaths = (
  coronaData: Corona,
  time: string = "2022-01-28",
  range: DataType
) => {
  if (countedDeaths.has(time + range)) return countedDeaths.get(time + range);
  const totals: Partial<HcdEventCount> = {};
  coronaData.deaths.forEach((death: Death) => {
    const hcdName = death.healthCareDistrict ?? unknownHcd;
    if (matchDate(time, death.date, range)) {
      return;
    }
    if (totals.hasOwnProperty(hcdName)) {
      totals[hcdName] = totals[hcdName] + 1;
    } else {
      totals[hcdName] = 1;
    }
  });
  countedDeaths.set(time + range, totals as HcdEventCount);
  return totals as HcdEventCount;
};

export const addInfectionCountsToFeature = (
  feature: Feature,
  counts: {
    allInfections: HcdEventCount;
    deceased: HcdEventCount;
  }
) => {
  const { allInfections, deceased } = counts;
  const hcdName = feature.properties
    .healthCareDistrict as HealthCareDistrictName;
  feature.properties.allInfections = allInfections[hcdName] ?? 0;
  feature.properties.deaths = deceased[hcdName] ?? 0;
};

export const deleteInfectionCountsInFeature = (feature: Feature) => {
  delete feature.properties.allInfections;
  delete feature.properties.decease;
};

export const sumValues = (data: HcdEventCount) => {
  return Object.values(data).reduce((a, c) => a + c, 0);
};
function matchDate(time: string, date: string, range: DataType) {
  if (range === DataType.TOTAL) return time && date > time + dateTail;
  if (range === DataType.DAILY) {
    return time && !date.includes(time);
  }
}
