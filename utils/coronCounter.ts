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

export const countAll = (coronaData: Corona, time: string = "2022-01-28") => {
  const totals: Partial<HcdEventCount> = {};
  coronaData.confirmed.forEach((confirm: Confirmed) => {
    const hcdName =
      confirm.healthCareDistrict ?? "Sairaanhoitopiiri ei tiedossa";
    if (time && confirm.date > time + dateTail) {
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

export const countCurrent = (
  coronaData: Corona,
  time: string = "2022-01-28"
) => {
  const totals: Partial<HcdEventCount> = countAll(coronaData, time);
  coronaData.recovered.forEach((recover: Recovered) => {
    const hcdName =
      recover.healthCareDistrict ?? "Sairaanhoitopiiri ei tiedossa";
    if (time && recover.date > time + dateTail) {
      return;
    }
    if (totals.hasOwnProperty(hcdName)) {
      totals[hcdName] = totals[hcdName] - 1;
    }
  });
  return totals as HcdEventCount;
};

export const countRecovered = (
  coronaData: Corona,
  time: string = "2022-01-28"
) => {
  const totals: Partial<HcdEventCount> = {};
  coronaData.recovered.forEach((recover: Recovered) => {
    const hcdName =
      recover.healthCareDistrict ?? "Sairaanhoitopiiri ei tiedossa";
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
  }
) => {
  const { curedInfections, currentInfections, allInfections } = counts;
  const hcdName = feature.properties
    .healthCareDistrict as HealthCareDistrictName;
  feature.properties.currentInfections = currentInfections[hcdName] ?? 0;
  feature.properties.curedInfections = curedInfections[hcdName] ?? 0;
  feature.properties.allInfections = allInfections[hcdName] ?? 0;
};

export const deleteInfectionCountsInFeature = (feature: Feature) => {
  delete feature.properties.currentInfections;
  delete feature.properties.curedInfections;
  delete feature.properties.allInfections;
};
