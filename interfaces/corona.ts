export interface Corona {
  confirmed: Confirmed[];
  deaths: any[];
  recovered: Recovered[];
}

export type HealthCareDistrictName =
  | "Etelä-Karjala"
  | "Etelä-Pohjanmaa"
  | "Etelä-Savo"
  | "HUS"
  | "Itä-Savo"
  | "Kainuu"
  | "Kanta-Häme"
  | "Keski-Pohjanmaa"
  | "Keski-Suomi"
  | "Kymenlaakso"
  | "Lappi"
  | "Länsi-Pohja"
  | "Pirkanmaa"
  | "Pohjois-Karjala"
  | "Pohjois-Pohjanmaa"
  | "Pohjois-Savo"
  | "Päijät-Häme"
  | "Satakunta"
  | "Vaasa"
  | "Varsinais-Suomi";

export interface Confirmed {
  id: string;
  date: string;
  healthCareDistrict: HealthCareDistrictName;
  infectionSourceCountry: InfectionSourceCountry | null;
  infectionSource: InfectionSourceEnum | number;
}

export enum InfectionSourceEnum {
  RelatedToEarlier = "related to earlier",
  Unknown = "unknown"
}

export enum InfectionSourceCountry {
  Aus = "AUS",
  Aut = "AUT",
  Chn = "CHN",
  Empty = "",
  Fin = "FIN",
  Irn = "IRN",
  Ita = "ITA",
  Swe = "SWE"
}

export interface Recovered {
  id: number | string;
  date: string;
  healthCareDistrict: HealthCareDistrict;
}

export enum HealthCareDistrict {
  Hus = "HUS",
  KantaHäme = "Kanta-Häme",
  Lappi = "Lappi"
}

// Converts JSON strings to/from your types
export class Convert {
  public static toCorona(json: string): Corona {
    return JSON.parse(json);
  }

  public static coronaToJson(value: Corona): string {
    return JSON.stringify(value);
  }
}
