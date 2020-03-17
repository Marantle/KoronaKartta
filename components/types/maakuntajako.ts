// To parse this data:
//
//   import { Convert, Municipalities } from "./file";
//
//   const municipalities = Convert.toMunicipalities(json);

export interface Municipalities {
    type:     string;
    name:     string;
    crs:      CRS;
    features: Feature[];
}

export interface CRS {
    type:       string;
    properties: CRSProperties;
}

export interface CRSProperties {
    name: string;
}

export interface Feature {
    type:       FeatureType;
    properties: FeatureProperties;
    geometry:   Geometry;
}

export interface Geometry {
    type:        GeometryType;
    coordinates: Array<Array<Array<number[] | number>>>;
}

export enum GeometryType {
    MultiPolygon = "MultiPolygon",
    Polygon = "Polygon",
}

export interface FeatureProperties {
    GML_ID:     number;
    NATCODE:    string;
    NAMEFIN:    string;
    NAMESWE:    string;
    LANDAREA:   number;
    FRESHWAREA: number;
    SEAWAREA:   number;
    TOTALAREA:  number;
    [key: string]: string | number;
}

export enum FeatureType {
    Feature = "Feature",
}

// Converts JSON strings to/from your types
export class Convert {
    public static toMunicipalities(json: string): Municipalities {
        return JSON.parse(json);
    }

    public static municipalitiesToJson(value: Municipalities): string {
        return JSON.stringify(value);
    }
}
