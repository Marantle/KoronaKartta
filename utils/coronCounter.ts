import {
  Confirmed,
  Corona,
  Death,
  Feature,
  HealthCareDistrictName
} from "../interfaces/corona";

export type HcdEventCount = {
  [key in HealthCareDistrictName]: number;
};

const dateTail = "T23:59:59.000Z";
const unknownHcd = "Sairaanhoitopiiri ei tiedossa";

const countedAlls = new Map<string, HcdEventCount>();
const countedDeaths = new Map<string, HcdEventCount>();

export const countAll = (coronaData: Corona, time: string = "2022-01-28") => {
  console.time(time);
  if (countedAlls.has(time)) return countedAlls.get(time);

  const totals: Partial<HcdEventCount> = {};
  coronaData.confirmed.forEach((confirm: Confirmed) => {
    const hcdName = confirm.healthCareDistrict ?? unknownHcd;
    if (time && confirm.date > time + dateTail) {
      return;
    }
    if (totals.hasOwnProperty(hcdName)) {
      totals[hcdName] = totals[hcdName] + (confirm.value || 1);
    } else {
      totals[hcdName] = confirm.value || 1;
    }
  });
  countedAlls.set(time, totals as HcdEventCount);
  return totals as HcdEventCount;
};

export const countDeaths = (
  coronaData: Corona,
  time: string = "2022-01-28"
) => {
  if (countedDeaths.has(time)) return countedDeaths.get(time);
  const totals: Partial<HcdEventCount> = {};
  coronaData.deaths.forEach((death: Death) => {
    const hcdName = death.healthCareDistrict ?? unknownHcd;
    if (time && death.date > time + dateTail) {
      return;
    }
    if (totals.hasOwnProperty(hcdName)) {
      totals[hcdName] = totals[hcdName] + 1;
    } else {
      totals[hcdName] = 1;
    }
  });
  countedDeaths.set(time, totals as HcdEventCount);
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
