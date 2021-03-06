import React, { useState, useEffect, useRef, useCallback } from "react";
import { NextPage } from "next";
import mapboxgl, { GeoJSONSource } from "mapbox-gl";
import CSS from "csstype";
import { HCD, HCDCentroid, CountPositions } from "../../interfaces/json";
import { Corona, Feature } from "../../interfaces/corona";
import debounce from "lodash/debounce";
import {
  HcdEventCount,
  countAll,
  addInfectionCountsToFeature,
  deleteInfectionCountsInFeature,
  countDeaths,
  sumValues,
} from "../../utils/coronaCounter";
import firebase from "../../utils/analytics";
import { extractDates } from "../../utils/date";
import { renderPopup } from "./popup";
import { isDarkMode } from "../../utils/dark";
import { DateSlider } from "../DateSlider";
import TotalCounter from "../TotalCounter";
import { DataType } from "../DataSwitcher";

// healthcaredistrict
const hcdLayerId = "municipalities";
const symbolLayerId = "centroidid";

mapboxgl.accessToken =
  "pk.eyJ1IjoibWFya29uZW4iLCJhIjoiY2s3cnBqc2xuMGZzbjNmb3UyZzgwMm54bSJ9.6ZyeMVZ3E-_b-r41VkscaQ";

let colorScheme = "mapbox://styles/markonen/ck7v4bl3r04vz1ilndc5p8a5w";
let textColor = "rgb(0, 0, 0)";
let textHalo = "rgba(255, 255, 255,0.7)";
let fillOpacity = 0.6;
let darkMode = false;

if (isDarkMode) {
  colorScheme = "mapbox://styles/markonen/ck7v43xa204p81ip70vkmi2l3";
  textColor = "rgb(255, 255, 255)";
  textHalo = "rgba(0, 0, 0,0.7)";
  fillOpacity = 0.3;
  darkMode = true;
}

const mapStyle: CSS.Properties = {
  right: 0,
  left: 0,
  top: 0,
  bottom: 0,
  position: "absolute",
};

export interface CoronaData {
  rawInfectionData: Corona;
  allInfections: HcdEventCount;
  deaths: HcdEventCount;
}

export interface TotalCounts {
  allInfections: string | number;
  deceased: string | number;
  title?: string;
}

interface Props {
  hcdGeoData: HCD;
  hcdCentroidGeoData: HCDCentroid;
  coronaData: CoronaData;
  countPositionsGeo: CountPositions;
}

const Map: NextPage<Props> = ({
  hcdGeoData,
  hcdCentroidGeoData,
  coronaData,
}) => {
  const [mapState] = useState({
    lat: 64.55056046409041,
    lng: 24.43946362291001,
    zoom: 4,
    minZoom: 4,
    maxZoom: 6,
  });

  const [currentRange, setCurrentRange] = useState(DataType.TOTAL);
  const distinctDates = extractDates(coronaData.rawInfectionData);
  const [currentDate, setCurrentDate] = useState(
    distinctDates[distinctDates.length - 1]
  );

  const [totalCounts, setTotalCounts] = useState<TotalCounts>();
  const [map, setMap] = useState<mapboxgl.Map>();
  // end state

  // ref used to hold the map
  const mapContainer = useRef<HTMLDivElement | null>(null);

  // initial use-effect to load the map
  useEffect(() => {
    const { allInfections, deaths: deceased } = coronaData;
    const initializeMap = () => {
      const map = new mapboxgl.Map({
        container: mapContainer.current as any,
        style: colorScheme,
        center: [mapState.lng, mapState.lat],
        zoom: mapState.zoom,
        minZoom: mapState.minZoom,
        maxZoom: mapState.maxZoom,
        fadeDuration: 0,
      });

      setTotalCounts({
        allInfections: sumValues(allInfections),
        deceased: sumValues(deceased),
      });

      map.on("load", () => {
        setMap(map);

        // map has loaded, populate geojson props with all counts
        const hcdGeoDataWithInfectionCounts: any = hcdGeoData;
        const centroidsWithInfectionCounts: any = hcdCentroidGeoData;

        hcdGeoDataWithInfectionCounts.features.forEach((f: any) =>
          addInfectionCountsToFeature(f, {
            allInfections,
            deceased,
          })
        );
        centroidsWithInfectionCounts.features.forEach((f: any) =>
          addInfectionCountsToFeature(f, {
            allInfections,
            deceased,
          })
        );
        const hcdSource = {
          type: "geojson",
          data: hcdGeoDataWithInfectionCounts,
        };

        const centroidSource = {
          type: "geojson",
          data: centroidsWithInfectionCounts,
        };

        // as any to bypass some weird mapbox typing
        map.addSource(hcdLayerId, hcdSource as any);
        map.addSource(symbolLayerId, centroidSource as any);
        // map.addSource(countsLayerId, countsSource as any);

        map.addLayer({
          id: hcdLayerId,
          type: "fill",
          source: hcdLayerId,
          layout: {},
          paint: {
            "fill-color": [
              "interpolate",
              ["linear"],
              ["get", "allInfections"],
              0,
              "#228B22",
              1,
              "#b3b300",
              100,
              "#ff9500",
              Math.max(...Object.values(allInfections)),
              "#8b0000",
            ],
            "fill-opacity": fillOpacity,
          },
        });

        if (!darkMode) {
          map.addLayer({
            id: "lines",
            type: "line",
            source: hcdLayerId,
            layout: {},
            paint: {
              "line-color": "#FFF",
              "line-opacity": 1,
              "line-width": 0.5,
            },
          });
        }

        map.addLayer({
          id: symbolLayerId,
          type: "symbol",
          source: symbolLayerId,
          layout: {
            "symbol-placement": "point",
            "text-font": ["Roboto Regular", "Arial Unicode MS Bold"],
            "text-field": "{allInfections}",
            "text-size": 28,
            "icon-allow-overlap": true,
            "text-allow-overlap": true,
          },
          paint: {
            "text-color": textColor,
            "text-halo-color": textHalo,
            "text-halo-width": 1,
          },
        });

        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          className: "kartta-popup",
        });

        map.on("click", function () {
          popup.remove();
        });

        map.on("click", hcdLayerId, function (e) {
          // merge mapbox feature style with ours to recover their properties
          const { properties } = e.features[0] as typeof e.features[0] &
            Feature;

          firebase.logEvent("select_content", {
            content_id: properties.healthCareDistrict,
          });

          popup
            .setLngLat(e.lngLat)
            .setDOMContent(renderPopup(properties))
            .addTo(map);
        });

        map.on("mouseenter", hcdLayerId, () => {
          map.getCanvas().style.cursor = "pointer";
        });

        map.on("mouseleave", hcdLayerId, () => {
          map.getCanvas().style.cursor = "";
          popup.remove();
        });

        map.resize();
      });
    };

    if (!map) initializeMap();

    return () => {};
  }, []);
  // end initial use-effect

  const updatedLayers = useCallback(
    debounce((selectedDate: string, map: mapboxgl.Map) => {
      const { rawInfectionData } = coronaData;
      const allInfections = countAll(
        rawInfectionData,
        selectedDate,
        currentRange
      );
      const deceased = countDeaths(
        rawInfectionData,
        selectedDate,
        currentRange
      );
      // geodata types come from json files automatically so we bypass them for this step
      const hcdLayerData: any = hcdGeoData;
      const symbolLayerData: any = hcdCentroidGeoData;

      hcdLayerData.features.forEach(deleteInfectionCountsInFeature);
      hcdLayerData.features.forEach((f: any) =>
        addInfectionCountsToFeature(f, {
          allInfections,
          deceased: deceased,
        })
      );

      symbolLayerData.features.forEach(deleteInfectionCountsInFeature);
      symbolLayerData.features.forEach((f: any) =>
        addInfectionCountsToFeature(f, {
          allInfections,
          deceased: deceased,
        })
      );

      (map.getSource(hcdLayerId) as GeoJSONSource).setData(hcdLayerData);
      (map.getSource(symbolLayerId) as GeoJSONSource).setData(symbolLayerData);

      setTotalCounts({
        allInfections: sumValues(allInfections),
        deceased: sumValues(deceased),
      });
    }, 0),
    [currentRange]
  );

  useEffect(() => {
    dateSliderChanged(null, null);
  }, [currentRange]);
  const dateSliderChanged = (
    e: React.ChangeEvent<{}>,
    value: number | number[]
  ) => {
    e && e.preventDefault();
    const d = value ? distinctDates[value as number] : currentDate;

    setCurrentDate(d);

    if (!map) return;
    updatedLayers(d, map);
  };
  const sliderProps = {
    distinctDates,
    dateSliderChanged,
  };

  return (
    <div>
      <div ref={(el) => (mapContainer.current = el)} style={mapStyle} />;
      <DateSlider {...sliderProps} />
      <TotalCounter {...{ ...totalCounts, setCurrentRange }} />
    </div>
  );
};

export default Map;
