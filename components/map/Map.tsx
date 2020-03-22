import React, { useState, useEffect, useRef } from "react";
import { NextPage } from "next";
import mapboxgl, { GeoJSONSource, Marker } from "mapbox-gl";
import CSS from "csstype";
import { HCD, HCDCentroid, CountPositions } from "../../interfaces/json";
import { Corona, Feature, Point } from "../../interfaces/corona";

import {
  HcdEventCount,
  countRecovered,
  countCurrent,
  countAll,
  addInfectionCountsToFeature,
  deleteInfectionCountsInFeature,
  countDeaths,
  sumValues
} from "../../utils/coronCounter";
import firebase from "../../utils/analytics";
import { extractDates } from "../../utils/date";
import { popupHtml } from "./popup";
import { isDarkMode } from "../../utils/dark";
import { Slider } from "../Slider";
import makeMarkerElement from "./makeMarkerElement";

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
  fillOpacity = 0.4;
  darkMode = true;
}

const mapStyle: CSS.Properties = {
  right: 0,
  left: 0,
  top: 0,
  bottom: 0,
  position: "absolute"
};

export interface CoronaData {
  rawInfectionData: Corona;
  allInfections: HcdEventCount;
  currentInfections: HcdEventCount;
  recovered: HcdEventCount;
  deaths: HcdEventCount;
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
  countPositionsGeo,
  coronaData
}) => {
  const [mapState] = useState({
    lat: 64.55056046409041,
    lng: 26.43946362291001,
    zoom: 4.5,
    minZoom: 4,
    maxZoom: 6
  });

  // get dates for the slider
  const distinctDates = extractDates(coronaData);

  // state
  const [selectedDate, setSelectedDate] = useState(
    distinctDates[distinctDates.length - 1]
  );
  const [marker, setMarker] = useState<Marker>(null);
  const [map, setMap] = useState<mapboxgl.Map>();
  // end state

  // ref used to hold the map
  const mapContainer = useRef<HTMLDivElement | null>(null);

  // initial use-effect to load the map
  useEffect(() => {
    const {
      allInfections,
      currentInfections,
      recovered: curedInfections,
      deaths
    } = coronaData;
    const initializeMap = () => {
      const map = new mapboxgl.Map({
        container: mapContainer.current as any,
        style: colorScheme,
        center: [mapState.lng, mapState.lat],
        zoom: mapState.zoom,
        minZoom: mapState.minZoom,
        maxZoom: mapState.maxZoom,
        fadeDuration: 0
      });

      countPositionsGeo.features[0].properties.count = sumValues(allInfections);
      countPositionsGeo.features[1].properties.count = sumValues(
        currentInfections
      );
      countPositionsGeo.features[2].properties.count = sumValues(
        curedInfections
      );
      countPositionsGeo.features[3].properties.count = sumValues(deaths);

      map.on("load", () => {
        setMap(map);

        // map has loaded, populate geojson props with all counts
        const hcdGeoDataWithInfectionCounts: any = hcdGeoData;
        const centroidsWithInfectionCounts: any = hcdCentroidGeoData;

        hcdGeoDataWithInfectionCounts.features.forEach((f: any) =>
          addInfectionCountsToFeature(f, {
            curedInfections,
            currentInfections,
            allInfections,
            deaths
          })
        );
        centroidsWithInfectionCounts.features.forEach((f: any) =>
          addInfectionCountsToFeature(f, {
            curedInfections,
            currentInfections,
            allInfections,
            deaths
          })
        );

        const hcdSource = {
          type: "geojson",
          data: hcdGeoDataWithInfectionCounts
        };

        const centroidSource = {
          type: "geojson",
          data: centroidsWithInfectionCounts
        };

        // const countsSource = {
        //   type: "geojson",
        //   data: countPositionsGeo
        // }

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
              ["get", "currentInfections"],
              0,
              "#1eff00",
              1,
              "#ff9500",
              100,
              "#ff0000",
              500,
              "#000000"
            ],
            "fill-opacity": fillOpacity
          }
        });
        map.addLayer({
          id: symbolLayerId,
          type: "symbol",
          source: symbolLayerId,
          layout: {
            "symbol-placement": "point",
            "text-font": ["Arial Unicode MS Bold"],
            "text-field": "{currentInfections}",
            "text-size": 28,
            "icon-allow-overlap": true,
            "text-allow-overlap": true
          },
          paint: {
            "text-color": textColor,
            "text-halo-color": textHalo,
            "text-halo-width": 1
          }
        });

        const { features } = countPositionsGeo;

        const [
          allPoint,
          currentPoint,
          recoveredPoint,
          deceasedPoint
        ] = features;

        const container = makeMarkerElement(
          allPoint as Point,
          currentPoint as Point,
          recoveredPoint as Point,
          deceasedPoint as Point
        );

        const marker = new mapboxgl.Marker(container);
        setMarker(marker);
        marker
          .setLngLat(allPoint.geometry.coordinates as [number, number])
          .addTo(map);

        // map.addLayer({
        //   id: countsLayerId,
        //   type: "symbol",
        //   source: countsLayerId,
        //   layout: {
        //     "symbol-placement": "point",
        //     "text-font": ["Arial Unicode MS Bold"],
        //     "text-field": "{count}",
        //     "text-size": 28,
        //     "icon-image": "{type}"
        //   },
        //   paint: {
        //     "text-color": textColor,
        //     "text-halo-color": textHalo,
        //     "text-halo-width": 1
        //   }
        // });

        if (!darkMode) {
          map.addLayer({
            id: "lines",
            type: "line",
            source: hcdLayerId,
            layout: {},
            paint: {
              "line-color": "#FFF",
              "line-opacity": 1,
              "line-width": 0.5
            }
          });
        }

        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false
        });

        map.on("click", hcdLayerId, function(e) {
          popup.remove();
          // merge mapbox feature style with ours to recover their properties
          const { properties } = e.features[0] as typeof e.features[0] &
            Feature;

          firebase.logEvent("select_content", {
            content_id: properties.healthCareDistrict
          });

          popup
            .setLngLat(e.lngLat)
            .setHTML(popupHtml(properties))
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

  // dateselection has changed, update layers
  useEffect(() => {
    if (!map) return;
    const { rawInfectionData } = coronaData;
    const allInfections = countAll(rawInfectionData, selectedDate);
    const curedInfections = countRecovered(rawInfectionData, selectedDate);
    const deaths = countDeaths(rawInfectionData, selectedDate);
    const currentInfections = countCurrent(
      rawInfectionData,
      selectedDate,
      allInfections
    );
    // geodata types come from json files automatically so we bypass them for this step
    const hcdLayerData: any = hcdGeoData;
    const symbolLayerData: any = hcdCentroidGeoData;

    hcdLayerData.features.forEach(deleteInfectionCountsInFeature);
    hcdLayerData.features.forEach((f: any) =>
      addInfectionCountsToFeature(f, {
        curedInfections,
        currentInfections,
        allInfections,
        deaths
      })
    );

    symbolLayerData.features.forEach(deleteInfectionCountsInFeature);
    symbolLayerData.features.forEach((f: any) =>
      addInfectionCountsToFeature(f, {
        curedInfections,
        currentInfections,
        allInfections,
        deaths
      })
    );

    (map.getSource(hcdLayerId) as GeoJSONSource).setData(hcdLayerData);
    (map.getSource(symbolLayerId) as GeoJSONSource).setData(symbolLayerData);

    countPositionsGeo.features[0].properties.count = sumValues(allInfections);
    countPositionsGeo.features[1].properties.count = sumValues(
      currentInfections
    );
    countPositionsGeo.features[2].properties.count = sumValues(curedInfections);
    countPositionsGeo.features[3].properties.count = sumValues(deaths);

    const { features } = countPositionsGeo;

    const [allPoint, currentPoint, recoveredPoint, deceasedPoint] = features;

    const container = makeMarkerElement(
      allPoint as Point,
      currentPoint as Point,
      recoveredPoint as Point,
      deceasedPoint as Point
    );
    marker.remove();
    const newMarker = new mapboxgl.Marker(container);

    newMarker
      .setLngLat(allPoint.geometry.coordinates as [number, number])
      .addTo(map);
    setMarker(newMarker);
  }, [selectedDate]);

  const dateSliderChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.nativeEvent.preventDefault();
    const d = distinctDates[Number(e.currentTarget.value)];
    setSelectedDate(d);
  };

  const sliderProps = { selectedDate, distinctDates, dateSliderChanged };
  return (
    <div>
      <div ref={el => (mapContainer.current = el)} style={mapStyle} />;
      <Slider {...sliderProps} />
    </div>
  );
};

export default Map;
