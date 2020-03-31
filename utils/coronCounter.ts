import {
  Corona,
  Confirmed,
  Recovered,
  HealthCareDistrictName,
  Feature
} from "../interfaces/corona";

export type HcdEventCount = {
  [key in HealthCareDistrictName]: number;
};

const dateTail = "T23:59:59.000Z";
const unknownHcd = "Sairaanhoitopiiri ei tiedossa";

export const countAll = (coronaData: Corona, time: string = "2022-01-28") => {
  const totals: Partial<HcdEventCount> = {};
  coronaData.confirmed.forEach((confirm: Confirmed) => {
    const hcdName = confirm.healthCareDistrict ?? unknownHcd;
    if (time && confirm.date > time + dateTail) {
      return;
    }
    if (totals.hasOwnProperty(hcdName)) {
      totals[hcdName] = totals[hcdName] + confirm.value;
    } else {
      totals[hcdName] = confirm.value;
    }
  });
  console.log(totals);
  return totals as HcdEventCount;
};

export const countCurrent = (
  coronaData: Corona,
  time: string = "2022-01-28",
  totalConfirmed: Partial<HcdEventCount>
) => {
  const current: Partial<HcdEventCount> = { ...totalConfirmed };
  const { recovered, deaths } = coronaData;
  [...recovered, ...deaths].forEach((recover: Recovered) => {
    const hcdName = recover.healthCareDistrict ?? unknownHcd;
    if (time && recover.date > time + dateTail) {
      return;
    }
    if (current.hasOwnProperty(hcdName)) {
      current[hcdName] = current[hcdName] - 1;
    }
  });
  return current as HcdEventCount;
};

export const countRecovered = (
  coronaData: Corona,
  time: string = "2022-01-28"
) => {
  return countDeathsOrRecovered(coronaData, time, "recovered");
};

export const countDeaths = (
  coronaData: Corona,
  time: string = "2022-01-28"
) => {
  return countDeathsOrRecovered(coronaData, time, "deaths");
};

const countDeathsOrRecovered = (
  coronaData: Corona,
  time: string = "2022-01-28",
  key: "recovered" | "deaths"
) => {
  const totals: Partial<HcdEventCount> = {};
  coronaData[key].forEach((recover: Recovered) => {
    const hcdName = recover.healthCareDistrict ?? unknownHcd;
    if (time && recover.date > time + dateTail) {
      return;
    }
    if (totals.hasOwnProperty(hcdName)) {
      totals[hcdName] = totals[hcdName] + 1;
    } else {
      totals[hcdName] = 1;
    }
  });
  return totals as HcdEventCount;
};

export const addInfectionCountsToFeature = (
  feature: Feature,
  counts: {
    curedInfections: HcdEventCount;
    currentInfections: HcdEventCount;
    allInfections: HcdEventCount;
    deceased: HcdEventCount;
  }
) => {
  const {
    curedInfections,
    currentInfections,
    allInfections,
    deceased
  } = counts;
  const hcdName = feature.properties
    .healthCareDistrict as HealthCareDistrictName;
  feature.properties.currentInfections = currentInfections[hcdName] ?? 0;
  feature.properties.curedInfections = curedInfections[hcdName] ?? 0;
  feature.properties.allInfections = allInfections[hcdName] ?? 0;
  feature.properties.deaths = deceased[hcdName] ?? 0;
};

export const deleteInfectionCountsInFeature = (feature: Feature) => {
  delete feature.properties.currentInfections;
  delete feature.properties.curedInfections;
  delete feature.properties.allInfections;
  delete feature.properties.decease;
};

export const sumValues = (data: HcdEventCount) => {
  return Object.values(data).reduce((a, c) => a + c, 0);
};
