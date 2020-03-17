import React, { useState, useEffect, useRef } from "react";
import { NextPage } from "next";
import mapboxgl, { GeoJSONSource } from "mapbox-gl";
import CSS from "csstype";
import { HCD, HCDCentroid } from "../interfaces/kuntajako";
import { Corona, HealthCareDistrictName } from "../interfaces/corona";
import { Feature } from "./types/maakuntajako";
import {
  HcdEventCount,
  countRecovered,
  countCurrent,
  countAll
} from "../utils/coronaCountUtil";

const townID = "municipalities";
const centroID = "centroidid";

mapboxgl.accessToken =
  "pk.eyJ1IjoibWFya29uZW4iLCJhIjoiY2s3cnBqc2xuMGZzbjNmb3UyZzgwMm54bSJ9.6ZyeMVZ3E-_b-r41VkscaQ";

let colorScheme = "mapbox://styles/markonen/ck7v4bl3r04vz1ilndc5p8a5w";
let textColor = "rgb(0, 0, 0)";
let textHalo = "rgba(255, 255, 255,0.7)";
let fillOpacity = 0.6;
let darkMode = false;

if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
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

interface Props {
  hcdGeoData: HCD;
  hcdCentroidGeoData: HCDCentroid;
  coronaData: {
    rawInfectionData: Corona;
    allInfections: HcdEventCount;
    currentInfections: HcdEventCount;
    curedInfections: HcdEventCount;
  };
}

const Map: NextPage<Props> = ({
  hcdGeoData,
  hcdCentroidGeoData,
  coronaData
}) => {
  const [mapState] = useState({
    lat: 61.4978,
    lng: 23.761,
    zoom: 5
  });

  const dateSet = 
    coronaData.rawInfectionData.confirmed
      .map(c => new Date(c.date))
      .map(d => `${d.getFullYear()}-${String(1+d.getMonth()).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`)
  ;
  coronaData.rawInfectionData.recovered
    .map(c => new Date(c.date))
    .map(d => `${d.getFullYear()}-${String(1+d.getMonth()).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`)
    .forEach(d => dateSet.push(d));
  const dates = [...new Set(dateSet)].sort();
  

  const [selectedDate, setSelectedDate] = useState(dates[dates.length - 1]);
  const [rawInfectionData] = useState(coronaData.rawInfectionData);
  const [currentInfections] = useState(coronaData.currentInfections);
  const [curedInfections] = useState(coronaData.curedInfections);
  const [allInfections] = useState(coronaData.allInfections);

  

  const [map, setMap] = useState<mapboxgl.Map>();
  const mapContainer = useRef<HTMLDivElement | null>(null);

  const addInfectionCounts = (
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
  const clearInfectionsCount = (feature: Feature) => {
    delete feature.properties.currentInfections;
    delete feature.properties.curedInfections;
    delete feature.properties.allInfections;
  };
  useEffect(() => {
    const initializeMap = () => {
      const map = new mapboxgl.Map({
        container: mapContainer.current as any,
        style: colorScheme,
        center: [mapState.lng, mapState.lat],
        zoom: mapState.zoom
      });
      map.on("load", () => {
        setMap(map);
        console.log("adding", townID);

        const hcdGeoDataWithInfectionCounts: any = hcdGeoData;
        const centroidsWithInfectionCounts: any = hcdCentroidGeoData;

        hcdGeoDataWithInfectionCounts.features.forEach((f: any) => addInfectionCounts(f, { curedInfections, currentInfections, allInfections }));
        centroidsWithInfectionCounts.features.forEach((f: any) => addInfectionCounts(f, { curedInfections, currentInfections, allInfections }));

        const source = {
          type: "geojson",
          data: hcdGeoDataWithInfectionCounts
        };
        map.addSource(townID, source as any);

        map.addLayer({
          id: townID,
          type: "fill",
          source: townID,
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
            // "fill-outline-color": "#FFF",
          }
        });

        const centroidSource = {
          type: "geojson",
          data: centroidsWithInfectionCounts
        };
        map.addSource(centroID, centroidSource as any);

        if (!darkMode) {
          map.addLayer({
            id: "lines",
            type: "line",
            source: townID,
            layout: {},
            paint: {
              "line-color": "#FFF",
              "line-opacity": 1,
              "line-width": 0.5
            }
          });
        }
        map.addLayer({
          id: "symbols",
          type: "symbol",
          source: centroID,
          layout: {
            "symbol-placement": "point",
            "text-font": ["Arial Unicode MS Bold"],
            "text-field": "{currentInfections}",
            "text-size": 28
          },
          paint: {
            "text-color": textColor,
            "text-halo-color": textHalo,
            "text-halo-width": 1
          }
        });
        console.log("added", townID);
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false
        });

        map.on("click", townID, function(e: any) {
          popup.remove();
          const {
            healthCareDistrict,
            allInfections,
            currentInfections,
            curedInfections
          } = e.features[0].properties;

          popup
            .setLngLat(e.lngLat)
            .setHTML(
              popupHtml(
                healthCareDistrict,
                allInfections,
                currentInfections,
                curedInfections
              )
            )
            .addTo(map);
        });

        map.on("mouseenter", townID, function() {
          console.log("on a thing");
          // Change the cursor style as a UI indicator.
          map.getCanvas().style.cursor = "pointer";
        });

        map.on("mouseleave", townID, function() {
          map.getCanvas().style.cursor = "";
          popup.remove();
        });

        // map.on("mousedown", function(e) {
        //   const lonlat = e.lngLat.wrap();
        //   console.log(`${lonlat.lng}, ${lonlat.lat}`);
        //   navigator.clipboard.writeText(`${lonlat.lng}, ${lonlat.lat}`);
        // });

        map.resize();
      });
    };

    if (!map) initializeMap();

    return () => {};
  }, []);
  // end initial use-effect

  useEffect(() => {
    console.log('update fired')
    if (!map) return;
    const curedInfections = countRecovered(rawInfectionData, selectedDate);
    const currentInfections = countCurrent(rawInfectionData, selectedDate);
    const allInfections = countAll(rawInfectionData, selectedDate);

    const hcdGeoDataWithInfectionCounts: any = hcdGeoData;
    const centroidsWithInfectionCounts: any = hcdCentroidGeoData;

    hcdGeoDataWithInfectionCounts.features.forEach(clearInfectionsCount);
    hcdGeoDataWithInfectionCounts.features.forEach((f: any) => addInfectionCounts(f, { curedInfections, currentInfections, allInfections }));

    centroidsWithInfectionCounts.features.forEach(clearInfectionsCount);
    centroidsWithInfectionCounts.features.forEach((f: any) => addInfectionCounts(f, { curedInfections, currentInfections, allInfections }));

    (map.getSource(townID) as GeoJSONSource).setData(
      hcdGeoDataWithInfectionCounts
    );
    (map.getSource(centroID) as GeoJSONSource).setData(
      centroidsWithInfectionCounts
    );
  }, [selectedDate]);

  const sliderContainerStyle: CSS.Properties = {
    zIndex: 1000,
    position: "absolute",
    left: "10%",
    right: "10%",
    bottom: "1%"
  };

  const dateSliderChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.nativeEvent.preventDefault();
    console.log(e.currentTarget.value, dates[Number(e.currentTarget.value)]);
    setSelectedDate(dates[Number(e.currentTarget.value)]);
  };
  return (
    <div>
      <div ref={el => (mapContainer.current = el)} style={mapStyle} />;
      <div style={sliderContainerStyle}>
        <p>{selectedDate}</p>
        <input
          type="range"
          id="diseasedate"
          name="diseasedate"
          list="mapsettings"
          min={0}
          max={dates.length - 1}
          defaultValue={dates.length - 1}
          onChange={dateSliderChanged}
        />
        <label htmlFor="diseasedate">Rajaa päivämäärää</label>
        <style jsx>{`
          label,
          p {
            font-family: "Roboto", sans-serif;
            font-size: 2em;
            width: 100%;
            display: block;
            text-align: center;
            line-height: 150%;
          }
          @media (prefers-color-scheme: dark) {
            label,
            p {
              color: white;
              -webkit-text-stroke-width: 0.5px;
              -webkit-text-stroke-color: black;
            }
          }
          input {
            padding-bottom: 10px;
            width: 100%;
          }
          input[type="range"] {
            -webkit-appearance: none;
            width: 100%;
            background: transparent;
          }

          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
          }

          input[type="range"]:focus {
            outline: none;
          }

          input[type="range"]::-ms-track {
            width: 100%;
            cursor: pointer;

            background: transparent;
            border-color: transparent;
            color: transparent;
          }
          /* Special styling for WebKit/Blink */
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            border: 1px solid #000000;
            height: 46px;
            width: 33px;
            border-radius: 3px;
            background: #ffffff;
            cursor: pointer;
            margin-top: -14px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
            box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d; /* Add cool effects to your sliders! */
          }

          /* All the same stuff for Firefox */
          input[type="range"]::-moz-range-thumb {
            box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
            border: 1px solid #000000;
            height: 46px;
            width: 33px;
            border-radius: 3px;
            background: #ffffff;
            cursor: pointer;
          }

          /* All the same stuff for IE */
          input[type="range"]::-ms-thumb {
            box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
            border: 1px solid #000000;
            height: 36px;
            width: 16px;
            border-radius: 3px;
            background: #ffffff;
            cursor: pointer;
          }
          input[type="range"]::-webkit-slider-runnable-track {
            width: 100%;
            height: 8.4px;
            cursor: pointer;
            box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
            background: #3071a9;
            border-radius: 1.3px;
            border: 0.2px solid #010101;
          }

          input[type="range"]:focus::-webkit-slider-runnable-track {
            background: #367ebd;
          }

          input[type="range"]::-moz-range-track {
            width: 100%;
            height: 8.4px;
            cursor: pointer;
            box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
            background: #3071a9;
            border-radius: 1.3px;
            border: 0.2px solid #010101;
          }

          input[type="range"]::-ms-track {
            width: 100%;
            height: 8.4px;
            cursor: pointer;
            background: transparent;
            border-color: transparent;
            border-width: 16px 0;
            color: transparent;
          }
          input[type="range"]::-ms-fill-lower {
            background: #2a6495;
            border: 0.2px solid #010101;
            border-radius: 2.6px;
            box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
          }
          input[type="range"]:focus::-ms-fill-lower {
            background: #3071a9;
          }
          input[type="range"]::-ms-fill-upper {
            background: #3071a9;
            border: 0.2px solid #010101;
            border-radius: 2.6px;
            box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
          }
          input[type="range"]:focus::-ms-fill-upper {
            background: #367ebd;
          }
        `}</style>
      </div>
    </div>
  );
};

const popupHtml = (
  healthCareDistrict: string,
  allInfections: number,
  currentInfections: number,
  curedInfections: number
) => {
  const s = "border-bottom: 1px solid #ddd;";
  const ss = "text-align:right;";
  const sss = "text-align:center;";
  return `
  <table>
  
      <thead>
        <tr>
            <th colspan="2"style="${s + sss}">${healthCareDistrict}</th>
        </tr>
      </thead>
      <tbody>
          <tr>
              <td style="${s}">Tartuntoja havaittu: </td>
              <td style="${s + ss}">${allInfections}</td>
              </tr>
          <tr>
              <td style="${s}">Kipeiden määrä: </td>
              <td style="${s + ss}">${currentInfections}</td>
          </tr>
          <tr>
              <td style="${s}">Parantuneet: </td>
              <td style="${s + ss}">${curedInfections}</td>
          </tr>
      </tbody>
  </table>
  `;
};

export default Map;
