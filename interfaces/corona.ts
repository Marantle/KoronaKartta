export interface Corona {
  confirmed: Confirmed[];
  deaths: Death[];
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
  value: number;
  date: string;
  healthCareDistrict: HealthCareDistrictName;
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
  value: number;
  date: string;
  healthCareDistrict: HealthCareDistrict;
}
export interface Death {
  value: number;
  date: string;
  healthCareDistrict: HealthCareDistrict;
}

export enum HealthCareDistrict {
  Hus = "HUS",
  KantaHäme = "Kanta-Häme",
  Lappi = "Lappi"
}

export interface Feature {
  type: "Feature";
  properties: FeatureProperties;
  geometry: Geometry;
}

export interface Point {
  type: "Point";
  properties: FeatureProperties;
  geometry: PointGeometry;
}

export interface Geometry {
  type: GeometryType;
  coordinates: Array<Array<Array<number[] | number>>>;
}

export interface PointGeometry {
  type: GeometryType;
  coordinates: number[];
}

export enum GeometryType {
  MultiPolygon = "MultiPolygon",
  Polygon = "Polygon"
}

export interface FeatureProperties {
  [key: string]: string | number;
}
