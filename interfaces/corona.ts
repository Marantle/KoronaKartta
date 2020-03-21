export interface Corona {
  confirmed: Confirmed[];
  deaths: Death[];
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
  | "Varsinais-Suomi"
  | "Ahvenanmaa"
  | "Sairaanhoitopiiri ei tiedossa";

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
export interface Death {
  id: number | string;
  date: string;
  healthCareDistrict: HealthCareDistrict;
}

export enum HealthCareDistrict {
  Hus = "HUS",
  KantaHäme = "Kanta-Häme",
  Lappi = "Lappi"
}

export interface Feature {
  type: FeatureType;
  properties: FeatureProperties;
  geometry: Geometry;
}

export enum FeatureType {
  Feature = "Feature"
}
export interface Geometry {
  type: GeometryType;
  coordinates: Array<Array<Array<number[] | number>>>;
}

export enum GeometryType {
  MultiPolygon = "MultiPolygon",
  Polygon = "Polygon"
}

export interface FeatureProperties {
  GML_ID: number;
  NATCODE: string;
  NAMEFIN: string;
  NAMESWE: string;
  LANDAREA: number;
  FRESHWAREA: number;
  SEAWAREA: number;
  TOTALAREA: number;
  [key: string]: string | number;
}
