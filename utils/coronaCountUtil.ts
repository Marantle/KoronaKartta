import { Corona, Confirmed, Recovered, HealthCareDistrictName } from "../interfaces/corona";

export type HcdEventCount = {
  [key in HealthCareDistrictName]: number;
};

const dateTail = "T23:59:59.000Z";

export function countAll(coronaData: Corona, time: string = "2022-01-28") {


  const totals: Partial<HcdEventCount> = {};
  coronaData.confirmed.forEach((confirm: Confirmed) => {
    if (time && confirm.date > time + dateTail) {
      return;
    }
    if (totals.hasOwnProperty(confirm.healthCareDistrict)) {
      totals[confirm.healthCareDistrict] =
        totals[confirm.healthCareDistrict] + 1;
    } else {
      totals[confirm.healthCareDistrict] = 1;
    }
  });
  return totals as HcdEventCount;
}

export function countCurrent(coronaData: Corona, time: string = "2022-01-28") {
  const totals: Partial<HcdEventCount> = countAll(coronaData, time);
  coronaData.recovered.forEach((recover: Recovered) => {
    if (time && recover.date > time + dateTail) {
      return;
    }
    if (totals.hasOwnProperty(recover.healthCareDistrict)) {
      totals[recover.healthCareDistrict] =
        totals[recover.healthCareDistrict] - 1;
    }
  });
  return totals as HcdEventCount;
}

export function countRecovered(coronaData: Corona, time: string = "2022-01-28") {
  const totals: Partial<HcdEventCount> = {};
  coronaData.recovered.forEach((recover: Recovered) => {
    if (time && recover.date > time + dateTail) {
      return;
    }
    if (totals.hasOwnProperty(recover.healthCareDistrict)) {
      totals[recover.healthCareDistrict] =
        totals[recover.healthCareDistrict] + 1;
    } else {
      totals[recover.healthCareDistrict] = 1;
    }
  });
  return totals as HcdEventCount;
}
