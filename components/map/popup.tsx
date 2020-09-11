import React from "react";
import ReactDOM from "react-dom";
import { FeatureProperties } from "../../interfaces/corona";
import TotalCounter from "../TotalCounter";

export interface TotalCounts {
  allInfections: number;
  deceased: number;
  title?: string;
}

export const renderPopup = ({
  healthCareDistrict: title,
  allInfections,
  deaths: deceased,
}: FeatureProperties) => {
  const el = (
    <TotalCounter
      allInfections={allInfections}
      deceased={deceased}
      title={title as string}
    />
  );
  const placeholder = document.createElement("div");
  ReactDOM.render(el, placeholder);
  return placeholder;
};
